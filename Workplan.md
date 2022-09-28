
# Workplan:


- Build basic ktor 2 EC2 server serving the client side, based off of AntiCancer code, including all the cool automatic build stuff.
  - [ ] Setup amazon EC2 server and get a full remote upload working. 
  - [ ] See if any ktor modules would be useful for us. 
  - [ ] implement ssl
- Implement upload crash, delete crash, mappings endpoints on EC2.
  -[ ] Implement tests for these, based off of ClientPlayground
  -[ ] Migrate client to support new endpoints
- Complete client mappings feature.
  - Move mappings selection, and make it not move when there's no version selection:  
  ![img.png](img.png)
- Experiment with templating the client, eventually serving the client merged with the crash data.

# Important things to check
- Website content is gzipped/brotli'd. It should work by pre-zipping JS files and templating HTML files with the full crash data and the needed headers for SEO, Discord and stuff. 




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