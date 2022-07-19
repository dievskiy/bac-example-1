# Break Access Control
This repository is probably the simplest example of Break Access Control vulnerability. BAC moved to the top of OWASP list in 2021 and thus represents a huge interest for many security researchers.

This is test message here in readme.
123123123
1231231233123
1231231233123sadsampda
samdasdoas
dasmdoiasdnoias
asnidoas


### Run demo
First, checkout to commit 53cc88a1b5826c1ba2b5ca8f59b4656928496cb8 and start the app by executing ```docker-compose up -d --build```.
Next, run following curl requests to ensure that BAC indeed takes place:
```shell
curl -X POST -d '{"username": "user", "password": "123123"}' -H "Content-Type: application/json" http://localhost:8011/api/users/register
curl -X POST -d '{"username": "hacker", "password": "123123"}' -H "Content-Type: application/json" http://localhost:8011/api/users/register
curl -H "Authorization: Bearer ${token for hacker user here}" -H "Content-Type: application/json" -X GET 'http://localhost:8011/api/profiles/profile?username=user'
```
This should give *secret* api key for the first user, meaning that horizontal privilege escalation has happened.
After that, checkout to 91af2694359c2aa986433ce4d5ae913a59770f79 and execute the last curl command:

```shell
curl -H "Authorization: Bearer ${token for hacker user here}" -H "Content-Type: application/json" -X GET 'http://localhost:8011/api/profiles/profile?username=user'
```
This should result in non-successful HTTP response.
