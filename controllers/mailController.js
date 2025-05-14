const nodemailer = require('nodemailer');
const crypto = require('crypto'); 
const bcrypt = require('bcrypt'); 
const User = require('../models/User');


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

// Solicitar recuperación de contraseña
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No hay ningún usuario con ese email.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: '🔐 Recuperación de contraseña',
      html: `
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `
    });

    res.status(200).json({ message: 'Correo de recuperación enviado.' });
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Restablecer contraseña
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = {
  sendMail,
  requestPasswordReset,
  resetPassword
};
