import requests
from radiojavanapi import Client
from radiojavanapi.exceptions import *
import sys
client = Client()
link =sys.argv[1]
if("https://rj.app" in link):
    link = requests.get(link).url
print(link)
if("podcasts/podcast"in link):
        try:
            client.login(email="EMAIL", password="PASSWORD")
            a = client.get_podcast_by_url(link).dict()
            print(a["permlink"]+" spit "+a["credit_tags"][0]+" spit "+a["hq_link"]+" spit "+a["tracklist"])

        except BadCredentials:
            print("somthing is wrong")

else:
    try:
        client.login(email="alirezaa222@gmail.com", password="1337779999")
        a = client.get_song_by_url(link).dict()
        print(a["song"]+" spit "+a["artist"]+" spit "+a["hq_link"]+" spit "+a["lyric"])
    except BadCredentials:
        print("somthing is wrong")
