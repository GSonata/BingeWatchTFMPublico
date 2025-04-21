const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    // Email para ti
    await transporter.sendMail({
      from: `"Contacto Web" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '📨 Nuevo mensaje de contacto',
      text: `De: ${email}\n\n${message}`,
    });

    // Email de confirmación al usuario
    await transporter.sendMail({
      from: `"Tu App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Hemos recibido tu mensaje',
      text: 'Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.',
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error al enviar el email:', error);
    res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
  }
};

module.exports = { sendMail };
