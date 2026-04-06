Copy-Item -Path ".\geo-template\*" -Destination ".\" -Recurse -Force -Exclude "node_modules", ".next"
Copy-Item -Path ".\geo-template\.gitignore" -Destination ".\.gitignore" -Force
Remove-Item -Recurse -Force ".\geo-template" -ErrorAction SilentlyContinue

git add .
git commit -m "feat: migrate to Next.js GEO template for cutisbioindigo.kr deployment"
git push
