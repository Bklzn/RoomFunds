from django.contrib.auth import get_user_model

def update_user_social_data(strategy, backend, user=None, response=None, *args, **kwargs):
    if user is None or response is None:
        return
    
    # Google data
    email = response.get("email")
    picture_url = response.get("picture")
    given_name = response.get("given_name")
    family_name = response.get("family_name")
  
    # Update user data
    user.first_name = given_name or user.first_name
    user.last_name = family_name or user.last_name
    user.email = email or user.email
    user.save()
    
    # update social auth
    social = user.social_auth.filter(provider=backend.name).first()
    if social:
        extra_data = social.extra_data or {}
        extra_data.update({
            'picture': picture_url,
        })
        social.extra_data = extra_data
        social.save()