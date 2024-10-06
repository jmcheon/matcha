from typing import Dict, Any
from aiosmtplib import SMTP
from fastapi import Response, HTTPException, status
from fastapi.responses import RedirectResponse
from email.message import EmailMessage
from constants import FASTAPI_HOST, GMAIL_ID, GMAIL_PASSWORD, NGINX_HOST, AccountStatus

import src.services.auth_service as auth_service
import src.services.account_service as account_service


# TODO: data validation
async def send_verification_email(data: Dict[str, Any], lang: str, token: str) -> None:
    account_id, username, email = data.values()
    print("send_verification_email():", lang, account_id, username, email)

    subject_template = {
        'en': '[Matcha-reloaded] Verify your email',
        'fr': '[Matcha-reloaded] Verifier votre email'
    }

    html_template = {
        'en': f'<a href="{FASTAPI_HOST}/verify-email?token={token}&lang=en">Verify your email for username: {username}</a>',
        'fr': f'<a href="{FASTAPI_HOST}/verify-email?token={token}&lang=fr">Vérifiez votre email pour votre username: {username}</a>',
    }



    subject = subject_template.get(lang, subject_template['en'])
    html = html_template.get(lang, html_template['en'])

    message = EmailMessage()
    message['From'] = GMAIL_ID
    message['To'] = email
    message['Subject'] = subject
    message.set_content(html, subtype='html')

    async with SMTP(hostname='smtp.gmail.com', port=587, start_tls=True) as smtp:
        await smtp.login(GMAIL_ID, GMAIL_PASSWORD)
        await smtp.send_message(message)

async def verify_email(res: Response, token: str, lang: str):
    # TODO: access token 만료시 에러처리
    payload = auth_service.decode_token(token)
    print("service verify_email() payload:", payload)
    # access token 만료시
    if payload is None:
        # temp exception
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
        # example
        redirect_url = f'{NGINX_HOST}/{lang}/auth/request-email'
        return RedirectResponse(url=redirect_url)
    account_id = payload["accountId"]

    account = await account_service.get_account_by_id(account_id)
    # print("service verify_email() account:", account)

    await account_service.update_account_status(account_id, AccountStatus.INCOMPLETE_PROFILE.value)
    auth_service.set_token_cookies(res, account_id)

    redirect_url = f'{NGINX_HOST}/{lang}/auth/generate-profile'
    return RedirectResponse(url=redirect_url)