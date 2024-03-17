<p >
  <a href="">
    <img alt="npm version" src="https://badgen.net/github/commits/ahsanu123/learnRepo/">
  </a>
  <a href="">
    <img alt="npm" src="https://badgen.net/github/contributors/ahsanu123/learnRepo/">
  </a>
  <a href="">
    <img alt="npm" src="https://badgen.net/github/branches/ahsanu123/learnRepo/">
  </a>
  <a href="https://github.com/ahsanu123/erpPlanner/blob/main/LICENSE">
    <img alt="licence" src="https://badgen.net/github/license/ahsanu123/learnRepo/">
  </a>
</p>

<p align="center">
  <a href="https://github.com/ahsanu123/solder-reflow">
   <img src="https://github.com/ahsanu123/learnRepo/blob/main/resource/planerp1.png" alt="SoreIcon">
  </a>
</p>
<h1 align="center">PlanerP</h1>
<p align="center">Your Personal Project Planner and Management 


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
