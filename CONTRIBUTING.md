Before start, you need to create a new branch with the issue id (issue + issue id). Always code inside this branch.

git checkout -b issue1
When you do a commit follow these simple rules:

You need to specify the type of commit:
feat: The new feature you're adding to a particular application
fix: A bug fix
style: Feature and updates related to styling
refactor: Refactoring a specific section of the codebase
test: Everything related to testing
docs: Everything related to documentation
chore: Regular code maintenance.
Always indicate the issue id;
Provide a short description of what you did;
An example of your commit description

feat [#1] - New endpoint returning all Provinces in Canada
