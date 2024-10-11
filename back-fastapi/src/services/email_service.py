from email.message import EmailMessage

import src.services.account_service as account_service
import src.services.auth_service as auth_service
from aiosmtplib import SMTP
from constants import BACK_HOST, GMAIL_ID, GMAIL_PASSWORD, NGINX_HOST, AccountStatus
from fastapi import HTTPException, Response, status
from fastapi.responses import RedirectResponse
from src.models.dto import RegisterAccountDTO


# TODO: data validation
# TODO: exception handling
async def send_verification_email(data: RegisterAccountDTO, lang: str, token: str) -> None:
    print("send_verification_email():", data, lang)

    subject_template = {
        "en": "[Matcha-reloaded] Verify your email",
        "fr": "[Matcha-reloaded] Verifier votre email",
    }

    html_template = {
        "en": f'<a href="{BACK_HOST}/verify-email?token={token}&lang=en">'
        + f"Verify your email for username: {data.username}</a>",
        "fr": f'<a href="{BACK_HOST}/verify-email?token={token}&lang=fr">'
        + f"Vérifiez votre email pour votre username: {data.username}</a>",
    }

    subject = subject_template.get(lang, subject_template["en"])
    html = html_template.get(lang, html_template["en"])

    message = EmailMessage()
    message["From"] = GMAIL_ID
    message["To"] = data.email
    message["Subject"] = subject
    message.set_content(html, subtype="html")

    async with SMTP(hostname="smtp.gmail.com", port=587, start_tls=True) as smtp:
        await smtp.login(GMAIL_ID, GMAIL_PASSWORD)
        await smtp.send_message(message)


async def verify_email(res: Response, token: str, lang: str):
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is required",
        )
    # TODO: access token 만료시 에러처리
    payload = auth_service.decode_token(token)
    print("service verify_email() payload:", payload)
    # access token 만료시
    if payload is None:
        # temp exception
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
        # example
        redirect_url = f"{NGINX_HOST}/{lang}/auth/request-email"
        return RedirectResponse(url=redirect_url, headers=res.headers)
    account_id = payload["account_id"]

    await account_service.get_account_by_id(account_id)

    await account_service.update_account_status(account_id, AccountStatus.INCOMPLETE_PROFILE.value)
    await auth_service.set_token_cookies(res, account_id)

    redirect_url = f"{NGINX_HOST}/{lang}/auth/generate-profile"
    return RedirectResponse(url=redirect_url, headers=res.headers)


# TODO: data validation
# TODO: exception handling
async def send_password_reset_email(data: dict, lang: str, token: str) -> None:
    (email,) = data.values()
    print("send_password_reset_email():", data, lang)

    subject_template = {
        "en": "[Matcha-reloaded] Password reset for Matcha",
        "fr": "[Matcha-reloaded] Reinitialisation du mot de passe pour Matcha",
    }

    html_template = {
        "en": f'<a href="{BACK_HOST}/reset-password?token={token}&lang=en">Password reset for Matcha</a>',
        "fr": f'<a href="{BACK_HOST}/reset-password?token={token}&lang=fr">Reinitialisation du mot de passe pour Matcha</a>',
    }

    subject = subject_template.get(lang, subject_template["en"])
    html = html_template.get(lang, html_template["en"])

    message = EmailMessage()
    message["From"] = GMAIL_ID
    message["To"] = email
    message["Subject"] = subject
    message.set_content(html, subtype="html")

    async with SMTP(hostname="smtp.gmail.com", port=587, start_tls=True) as smtp:
        await smtp.login(GMAIL_ID, GMAIL_PASSWORD)
        await smtp.send_message(message)
