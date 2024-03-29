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
