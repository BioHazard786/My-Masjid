import type { Bindings } from "@api/index";

interface TranslationResult {
  english: string;
  hindi: string;
  urdu: string;
}

interface MasjidTranslationResult {
  name: {
    english: string;
    hindi: string;
    urdu: string;
  };
  address: {
    english: string;
    hindi: string;
    urdu: string;
  };
}

async function translateText(
  text: string,
  targetLanguage: string,
  env: Bindings
): Promise<string> {
  const API_KEY = env.GOOGLE_TRANSLATE_API_KEY;

  // Try the API domain first (translate-pa.googleapis.com)
  try {
    const payload = [[[text], "auto", targetLanguage], "wt_lib"];

    const apiResponse = await fetch(env.GOOGLE_TRANSLATE_API_URL, {
      method: "POST",
      headers: {
        Host: env.GOOGLE_TRANSLATE_API_HOST,
        "X-Goog-API-Key": API_KEY,
        "Content-Type": "application/json+protobuf",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: JSON.stringify(payload),
    });

    if (apiResponse.ok) {
      const responseText = await apiResponse.text();
      try {
        const jsonResponse = JSON.parse(responseText);
        // Extract translated text from the response structure
        if (jsonResponse && jsonResponse[0] && jsonResponse[0][0]) {
          return jsonResponse[0][0];
        }
      } catch (e) {
        console.warn(`Failed to parse API response for ${targetLanguage}:`, e);
      }
    }
  } catch (error) {
    console.warn(
      `API domain request failed for ${targetLanguage}, trying public endpoint:`,
      error
    );
  }

  // Fallback to public translate endpoint
  try {
    const params = new URLSearchParams({
      client: "gtx",
      sl: "auto",
      tl: targetLanguage,
      dt: "t",
      q: text,
    });

    const fullUrl = `${env.GOOGLE_TRANSLATE_PUBLIC_API_URL}?${params}`;
    const publicResponse = await fetch(fullUrl);
    const responseText = await publicResponse.text();

    try {
      const jsonResponse = JSON.parse(responseText);
      // Extract translated text from Google Translate public API response
      if (
        jsonResponse &&
        jsonResponse[0] &&
        jsonResponse[0][0] &&
        jsonResponse[0][0][0]
      ) {
        return jsonResponse[0][0][0];
      }
    } catch (e) {
      console.warn(
        `Failed to parse public API response for ${targetLanguage}:`,
        e
      );
    }
  } catch (error) {
    console.warn(
      `Public API request also failed for ${targetLanguage}:`,
      error
    );
  }

  // If both methods fail, return the original text
  return text;
}

export async function getTranslations(
  text: string,
  env: Bindings
): Promise<TranslationResult> {
  try {
    // Use Promise.all to get translations for all three languages simultaneously
    const [english, hindi, urdu] = await Promise.all([
      translateText(text, "en", env),
      translateText(text, "hi", env),
      translateText(text, "ur", env),
    ]);

    return {
      english,
      hindi,
      urdu,
    };
  } catch (error) {
    console.error("Error getting translations:", error);

    // If Promise.all fails, return the original text for all languages
    return {
      english: text,
      hindi: text,
      urdu: text,
    };
  }
}

export async function getMasjidTranslations(
  name: string,
  address: string,
  env: Bindings
): Promise<MasjidTranslationResult> {
  try {
    // Get translations for the combined text
    const translations = await getTranslations(`${name} | ${address}`, env);

    // Helper function to split translated text safely
    const splitTranslation = (
      translatedText: string,
      originalName: string,
      originalAddress: string
    ) => {
      const parts = translatedText.split(" | ");

      if (parts.length >= 2) {
        return {
          name: (parts[0] || originalName).trim(),
          address: (parts[1] || originalAddress).trim(),
        };
      } else {
        // If separator not found, return original parts as fallback
        return {
          name: originalName,
          address: originalAddress,
        };
      }
    };

    // Split each translation
    const englishParts = splitTranslation(translations.english, name, address);
    const hindiParts = splitTranslation(translations.hindi, name, address);
    const urduParts = splitTranslation(translations.urdu, name, address);

    return {
      name: {
        english: englishParts.name,
        hindi: hindiParts.name,
        urdu: urduParts.name,
      },
      address: {
        english: englishParts.address,
        hindi: hindiParts.address,
        urdu: urduParts.address,
      },
    };
  } catch (error) {
    console.error("Error getting masjid translations:", error);

    // If translation fails, return the original text for all languages
    return {
      name: {
        english: name,
        hindi: name,
        urdu: name,
      },
      address: {
        english: address,
        hindi: address,
        urdu: address,
      },
    };
  }
}
