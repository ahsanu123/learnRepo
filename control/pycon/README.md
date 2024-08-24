## Introduction 

## Environment Setup

Environment was setup with `micromamba` 

- `micromamba create -n control`
- next install requirement (note: `mmamba` is alias for `micromamba`)

```shell
$ mmamba install control slycot -c conda-forge
conda-forge/linux-64                                        Using cache
conda-forge/noarch                                          Using cache

Transaction

  Prefix: /home/ahsanu/micromamba/envs/control

  Updating specs:

   - control
   - slycot
```

- finally activate with `mmamba activate control`
- to export into yml file use `mmamba env export -n control > env.yml`
- to install from yml file use `micromamba create -f env.yml`
- read more about setup in [mamba documentation](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html#conda-yaml-spec-files)

