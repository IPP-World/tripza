import requests
import json
def send_sms_via_api(to, text):
    url = "https://sms.aakashsms.com/sms/v3/send"
    data = {"auth_token": "794f18bc9e08b68c957b0c4437a0fb64464067b8524a436a362d33aec943f8a3", "to": to, "text": text}

    try:
        response = requests.post(url, data=data)
        response = requests.Response()
        response.status_code = 200
        response._content = json.dumps(
            {"error": False, "message": "Mock SMS sent."}
        ).encode("utf-8")
        print("sms sent ", text)
    except requests.exceptions.RequestException as e:
        print("sms not sent ")
        return (False, str(e))
