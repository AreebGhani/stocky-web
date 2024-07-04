"use server"

export const CheckRecaptcha = async (recaptchaValue: string) => {
    try {
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaValue}`, {
            method: 'POST',
        });
        return response.json();
    } catch (error) {
        return error;
    }
}
