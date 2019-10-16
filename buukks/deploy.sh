echo "buukks.xyz" > CNAME
git commit -am "Save local changes for deploy"
git checkout -B gh-pages
git add -f build
git commit -am "Rebuild website"
git filter-branch -f --prune-empty --subdirectory-filter build
git push -f origin gh-pages
touch CNAME
echo "buukks.xyz" > CNAME
git add .
git commit -am "Add CNAME"
git push
git checkout -
