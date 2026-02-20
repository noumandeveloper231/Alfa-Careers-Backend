import express from 'express'
import fetch from 'node-fetch'

const whatsapppRouter = express.Router()

const apiBaseUrl = process.env.API_BASE_URL
const bearerToken = process.env.WHATSAPP_BEARER_TOKEN
const vendorUid = process.env.VENDOR_UID

// ================== HELPER ==================
const whatsappFetch = async (endpoint, method, body = null) => {
    const response = await fetch(`${apiBaseUrl}/${vendorUid}/contact${endpoint}`, {
        method,
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
    })
    
    const data = await response.json()
    console.log('data', data)

    if (!response.ok) {
        throw new Error(data?.message || 'WhatsApp API Error')
    }

    return data
}

// ================== MESSAGE ==================

// Send Text Message
whatsapppRouter.post('/send-message', async (req, res) => {
    try {
        const { phoneNumber, messageBody } = req.body

        console.log('phoneNumber, messageBody', phoneNumber, messageBody)

        if (!phoneNumber || !messageBody) {
            return res.status(400).json({ message: 'phoneNumber & messageBody required' })
        }

        const data = await whatsappFetch('/send-message', 'POST', {
            phone_number: phoneNumber,
            message_body: messageBody
        })

        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Send Media Message
whatsapppRouter.post('/send-media-message', async (req, res) => {
    try {
        const data = await whatsappFetch('/send-media-message', 'POST', req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Send Template Message
whatsapppRouter.post('/send-template-message', async (req, res) => {
    try {
        const data = await whatsappFetch('/send-template-message', 'POST', req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Send Interactive Message
whatsapppRouter.post('/send-interactive-message', async (req, res) => {
    try {
        const data = await whatsappFetch('/send-interactive-message', 'POST', req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Send Carousel Template Message
whatsapppRouter.post('/send-carousel-template-message', async (req, res) => {
    try {
        const data = await whatsappFetch('/send-carousel-template-message', 'POST', req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ================== CONTACT ==================

// Create Contact
whatsapppRouter.post('/create-contact', async (req, res) => {
    try {
        const data = await whatsappFetch('/create-contact', 'POST', req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Update Contact
whatsapppRouter.post('/update-contact', async (req, res) => {
    try {
        const data = await whatsappFetch('/update-contact', 'POST', req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get Single Contact
whatsapppRouter.get('/contact/:phone', async (req, res) => {
    try {
        const data = await whatsappFetch(`/contact/${req.params.phone}`, 'GET')
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get All Contacts
whatsapppRouter.get('/contacts', async (req, res) => {
    try {
        const data = await whatsappFetch('/contacts', 'GET')
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ================== TEAM ==================

// Assign Team Member
whatsapppRouter.post('/assign-team-member', async (req, res) => {
    try {
        const data = await whatsappFetch('/assign-team-member', 'POST', req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default whatsapppRouter;