import { v2 } from "@google-cloud/translate";

const translate = new v2.Translate({ key: Bun.env.GOOGLE_CLOUD_TRASLATION })

export async function translateText(text: string, target: string) {
    try {
        const [translation] = await translate.translate(text, target)
        return translation
    } catch (error) {
        console.error(error)
        throw new Error('Erro ao fazer tradução')
    }
}