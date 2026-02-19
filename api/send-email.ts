import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Template Dictionary (Simple HTML for now, can be expanded to React templates later)
const TEMPLATES = {
    shop_welcome: (name) => ({
        subject: 'Bienvenido a Dentaxy Shop - Acceso Exclusivo',
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h1>Hola ${name},</h1>
                <p>Bienvenido al futuro de la odontología. Tu acceso a <strong>Dentaxy Shop</strong> ha sido habilitado.</p>
                <p>Explora nuestro catálogo de productos premium y lleva tu consultorio al siguiente nivel.</p>
                <br/>
                <a href="https://dentaxy.com/shop" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir a la Tienda</a>
            </div>
        `
    }),
    seed_access: (name) => ({
        subject: 'Tu Semilla ha sido Plantada - Dentaxy Seed',
        html: `
             <div style="font-family: sans-serif; color: #333;">
                <h1>Hola ${name},</h1>
                <p>Has sido seleccionado para el programa <strong>Dentaxy Seed</strong>.</p>
                <p>Comienza a digitalizar tu práctica hoy mismo con nuestra tecnología de asistencia clínica.</p>
                <br/>
                <a href="https://dentaxy.com/seed" style="background-color: #2563eb; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Acceder a Seed</a>
            </div>
        `
    }),
    p2p_success: (name) => ({
        subject: 'Transferencia Exitosa - Dentaxy Nexus',
        html: `
             <div style="font-family: sans-serif; color: #333;">
                <h1>Transferencia Completada</h1>
                <p>Hola ${name},</p>
                <p>Hemos recibido tus archivos a través de nuestra red segura <strong>Nexus P2P</strong>.</p>
                <p>Gracias por confiar en la tecnología Dentaxy.</p>
            </div>
        `
    })
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to, template, name } = req.body;

    if (!to || !template || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const selectedTemplate = TEMPLATES[template];

    if (!selectedTemplate) {
        return res.status(400).json({ error: 'Invalid template' });
    }

    const { subject, html } = selectedTemplate(name);

    try {
        const data = await resend.emails.send({
            from: 'Dentaxy <onboarding@resend.dev>', // Update this with your verified domain later
            to: [to],
            subject: subject,
            html: html,
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
}
