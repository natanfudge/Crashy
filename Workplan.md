
# Workplan:
- [ ] Monetization?
- [ ] Implement and test method of transfering crashlogs from firebase to EC2/S3
  - Write in the 'parallel uploading' section how we will actually do it
- [ ] Do some sufficient testing on real server
- [ ] Parallel uploading of everything:
  - [ ] Research how to change crashy.net to point to the ec2 IP in namecheap
  - [ ] Update crashy.net to new server
    - [ ] Set `build.txt` to `release`
    - [ ] Run `Upload Server`
    - [ ] Update namecheap record 
    - [ ] Run tests on release server
  - [ ] Update server to have SSL matching crashy.net and set build.txt to release
    - [ ] Use certbot to generate PEM certificate https://certbot.eff.org/instructions?ws=other&os=ubuntufocal
    - [ ] Convert PEM to PKCS12 using openssl `pkcs12 -export -in cert.pem -inkey key.pem -out keystore_release.p12 -name "CrashyCertificate"`
    - [ ] Convert PKCS12 to JKS using keytool `keytool -importkeystore -srckeystore keystore_release.p12 -srcstoretype pkcs12 -destkeystore /etc/cert/crashy_release_keystore.jks"`
    - [ ] Test https
  - [ ] Update firebase upload function to redirect to new server
    - In `compat/`, set `betaBuild` to `false`
    - Change the name of `uploadCrashNew` to `uploadCrash`
    - Upload: `firebase deploy --only functions`
  - [ ] Download all existing crashlogs and upload them to the new server.
    - [ ] Run FirebaseMigration to migrate any remaining crash logs
  - [ ] Update NEC to support new crashy.net
    - [ ] Upload branch newCrashy
  - [ ] Make post about some logs being potentially lost and reporting this
  - [ ] Once everything works - shut down old site and functions

- 

# Final goals:
- Crashy pages served directly from the server, including the crash data itself with it, making response times very fast, and allowing previews of crashes in links
- Integrate the mappings feature completely
- Introduce monetization to at least cover for server costs
- Fix a few critical opened Crashy issues (including improve logging)

# Services:

- One EC2 server (Start with the free one and see how it goes) serving pages and some mappings. 
- General Purpose SSD (gp3) holding recently accessed crash logs and some mappings.
- Tiered S3 holding old crash logs.

# Operation:

- EC2 server receives a Crashy request. 
  - The requested ID is checked against the local SSD. If it doesn't exist, the 'no such crash log' page is returned.
  - If the crash does exist, the React app is returned, which is templated to accept the crash data. 
  - If the crash was gotten from the S3 it's put back into the SSD. 
  - The SSD maintains a bidirectional map of 'Crash Id' to `Last Access Day'. This means that when a crash is returned this map is updated. 
    - Every day or at will, all crash logs with last access day of <CurrentDay - 30> will be transferred to the S3 where it will be tiered automatically by Amazon.
- In some cases the EC2 server will receive a mappings data request. The server will request the mappings from the appropriate provider and cache it for 30 days in the SSD. (Works the same way as crash logs, a bidirectional map is needed as well)
- EC2 server supports upload crash and delete crash endpoints.
