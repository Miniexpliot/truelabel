// server/server.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Set up Multer for handling file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: "active",
    message: "TrueLabel backend Express server is running successfully. Use POST /scan with a food label image to analyze ingredients."
  });
});

// Scan Route
app.post('/scan', upload.single('image'), async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.warn("Backend warning: GEMINI_API_KEY is not configured. Returning fallback mock response.");
      return res.json(getFallbackData(req.file.originalname));
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    // Use gemini-2.5-flash as default, fallback to gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const promptText = `Analyze the attached food ingredient label image. Return a detailed JSON report about this product. The output MUST match this exact schema:
{
  "product_name": "Name of the product (or detected product name)",
  "deception_score": 75, // Integer score from 0 (perfectly healthy/clean) to 100 (extreme deception/unhealthy/chemical scam)
  "brutal_truth_hinglish": "A brutal, blunt roast of this product in Hinglish (Hindi written in Latin script, e.g., 'Bhai, yeh juice nahi, sirf chini ka paani hai...'), exposing the marketing tricks and lies.",
  "harmful_ingredients": [
    {
      "name": "Name of ingredient (e.g. Palm Oil)",
      "fact": "Short, punchy explanation in English of why it is harmful/unhealthy."
    }
  ],
  "good_ingredients": [
    {
      "name": "Name of ingredient (e.g. Whole Wheat)",
      "benefit": "Short explanation in English of why it is good/healthy."
    }
  ],
  "desi_swap": "A healthy, natural, traditional Indian replacement/alternative (e.g. roasted chana, homemade buttermilk, nimbu paani)."
}

CRITICAL REQUIREMENT: If the uploaded image does not contain a food product, does not show a readable list of ingredients, or is too blurry/unreadable to extract ingredients, you MUST return this exact response:
{
  "product_name": "Invalid Ingredients Label",
  "deception_score": 0,
  "brutal_truth_hinglish": "Oops! Mujhe is image mein ingredients list nahi mili. Please ingredients label ki ek clear photo khinch ke upload karein!",
  "harmful_ingredients": [],
  "good_ingredients": [],
  "desi_swap": "Please provide a readable ingredients list."
}

Expose marketing lies. For example, if a product claims 'high protein' but contains palm oil, high sugar, or maltodextrin, call that out in the Hinglish roast. Be extremely honest and funny, like a health inspector who is also a stand-up comedian.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            product_name: { type: "STRING" },
            deception_score: { type: "INTEGER" },
            brutal_truth_hinglish: { type: "STRING" },
            harmful_ingredients: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  fact: { type: "STRING" }
                },
                required: ["name", "fact"]
              }
            },
            good_ingredients: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  benefit: { type: "STRING" }
                },
                required: ["name", "benefit"]
              }
            },
            desi_swap: { type: "STRING" }
          },
          required: ["product_name", "deception_score", "brutal_truth_hinglish", "harmful_ingredients", "good_ingredients", "desi_swap"]
        }
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error status:", response.status, errorText);
      throw new Error(`Gemini API returned error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse response
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("Empty response from Gemini model.");
    }

    const result = JSON.parse(candidateText.trim());
    return res.json(result);

  } catch (error) {
    console.error("Scan processing error:", error);
    return res.status(500).json({ 
      error: "Failed to analyze ingredients. Please make sure the image is clear, readable, and you have configured a valid GEMINI_API_KEY." 
    });
  }
});

// Helper for generating fallback data if API is down or key is missing
function getFallbackData(filename = "") {
  console.log("Generating fallback response for file:", filename);
  
  // Try to determine category from filename keyword to make it feel smart even offline
  const lowerFile = filename.toLowerCase();
  
  if (lowerFile.includes("coke") || lowerFile.includes("soda") || lowerFile.includes("juice") || lowerFile.includes("drink") || lowerFile.includes("beverage")) {
    return {
      product_name: "Mock Fizzy Orange Drink",
      deception_score: 85,
      brutal_truth_hinglish: "Bhai, label pe likha hai 'Fresh Orange & Real Fruit' par asal mein yeh bas high fructose syrup aur carbonated paani hai. 100% scam chal raha hai!",
      harmful_ingredients: [
        {
          name: "High Fructose Corn Syrup",
          fact: "Spikes insulin and blood sugar instantly, contributing directly to fatty liver disease."
        },
        {
          name: "Artificial Color Sunset Yellow (FCF)",
          fact: "Derived from petroleum chemicals; linked to hyperactivity in children and banned in several countries."
        },
        {
          name: "Sodium Benzoate",
          fact: "Preservative that can react with vitamin C to produce benzene, a known carcinogen."
        }
      ],
      good_ingredients: [
        {
          name: "Purified Water",
          fact: "Keeps you hydrated, though sugar content overrides the benefits."
        }
      ],
      desi_swap: "Fresh Orange Juice (no sugar added) or traditional Nimbu Shanjivi."
    };
  }

  if (lowerFile.includes("noodles") || lowerFile.includes("maggie") || lowerFile.includes("ramen") || lowerFile.includes("instant")) {
    return {
      product_name: "Mock Instant Masala Noodles",
      deception_score: 90,
      brutal_truth_hinglish: "Sirf 2 minute mein tayaar hone wali bimari! Maida, palm oil aur heavy sodium ka combo jo aapke liver aur gut ko direct damage karta hai.",
      harmful_ingredients: [
        {
          name: "Refined Wheat Flour (Maida)",
          fact: "Stripped of all natural fibers, acts like glue in your intestines, stalling digestion."
        },
        {
          name: "Refined Palm Oil",
          fact: "Highly processed saturated fat that increases bad cholesterol and arterial clogging risks."
        },
        {
          name: "Monosodium Glutamate (MSG)",
          fact: "Flavor enhancer that triggers overeating signals in the brain and can cause headaches."
        }
      ],
      good_ingredients: [
        {
          name: "Dehydrated Onion & Garlic Powder",
          benefit: "Contains basic antioxidants, but in trace amounts."
        }
      ],
      desi_swap: "Homemade Veg Sewai (Vermicelli) with lots of real veggies and mustard seeds."
    };
  }

  if (lowerFile.includes("bar") || lowerFile.includes("cookie") || lowerFile.includes("protein") || lowerFile.includes("health")) {
    return {
      product_name: "Mock Healthy Oats & Nut Cookie",
      deception_score: 55,
      brutal_truth_hinglish: "Health ke naam pe mithaas! Labeled 'No Added Sugar' par peeche Maltodextrin aur liquid glucose chhupa rakha hai. Thoda sambhal ke!",
      harmful_ingredients: [
        {
          name: "Maltodextrin",
          fact: "Has a higher glycemic index than white sugar, causing massive blood sugar spikes."
        },
        {
          name: "Processed Soy Protein Isolate",
          fact: "Highly refined protein extract that can be hard to digest for sensitive stomachs."
        }
      ],
      good_ingredients: [
        {
          name: "Rolled Oats (15%)",
          benefit: "Good source of beta-glucan soluble fiber, which supports healthy cholesterol levels."
        },
        {
          name: "Almonds & Cashews (5%)",
          benefit: "Provides healthy monounsaturated fats and essential minerals like magnesium."
        }
      ],
      desi_swap: "Roasted Makhana (Fox Nuts) with a pinch of ghee and turmeric, or standard roasted chana."
    };
  }

  // Default General Packaged Snack
  return {
    product_name: "Mock Crispy Salty Namkeen",
    deception_score: 75,
    brutal_truth_hinglish: "Zero Cholesterol likh ke bech rahe hain, par refined palm oil mein deep fry kiya hua hai. Aise cholesterol kam nahi hota, dosto!",
    harmful_ingredients: [
      {
        name: "Refined Palm Oil",
        fact: "Highly saturated fat that undergoes industrial processing, boosting cardiac risks."
      },
      {
        name: "Acidity Regulators (INS 330)",
        fact: "Industrial citric acid. Fine in small quantities, but often causes acid reflux when overconsumed."
      }
    ],
    good_ingredients: [
      {
        name: "Gram Flour (Besan)",
        benefit: "A gluten-free flour source offering protein and iron compared to refined flour."
      }
    ],
    desi_swap: "Roasted chickpeas (chana), puff rice mix (bhel), or dry roasted peanuts."
  };
}

// Start Server
app.listen(PORT, () => {
  console.log(`TrueLabel backend running on http://localhost:${PORT}`);
});
