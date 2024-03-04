## PlannerP
this would be project use dotnet and angular to make ERP for electronic project and price/sales planning



## Generating SSH Key

  1. generate new ssh key from https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
  2. add to your github setting https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account
  3. if there is already ssh key with diference email, delete `id_rsa` and `id_rsa.pub` in .ssh folder 
  4. then run this command to change your email 
  
      ```shell
        $> ssh-keygen -c

        Enter file in which the key is (/Users/bob/.ssh/id_rsa): id_ed25519
        Enter passphrase:
        Old comment: bob@bob.com
        New comment: arthur@bob.com

        # then 
        ssh-add -d ~/.ssh/id_ed25519
        ssh-add ~/.ssh/id_ed25519
      ```
  5.  and recreate from step 1 to 2
