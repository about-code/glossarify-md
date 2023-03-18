# Install

### Option 1: Install *locally*, init, configure, run:

~~~
cd ./your-project
npm install glossarify-md

npx glossarify-md --init --new --local
npx glossarify-md --config ./glossarify-md.conf.json
~~~

When installing locally you might want to set up a shortcut by adding a run script to your `package.json`:

~~~json
{
  "scripts": {
    "glossarify": "glossarify-md --config ./glossarify-md.conf.json"
  }
}
~~~

Now use:

~~~
npm run glossarify
~~~

### Option 2: Install *globally*, init, configure, run:

~~~
npm install -g glossarify-md

glossarify-md --init --new
glossarify-md --config ./glossarify-md.conf.json
~~~

> **ⓘ** Many editors and IDEs use a `$schema` configuration schema declaration to provide you with assistance in editing a JSON config file. Installing glossarify-md globally will require `$schema` to point to a configuration schema hosted on GitHub. That schema refers to the version that has been used when the configuration file was created, initially. Later, when updating the global installation of glossarify-md pointers in your project configurations won't be updated and continue to point the config schema version at initialization time. This is not an issue at all. Just note that editors won't suggest newer options from the latest globally installed release unless you update the `$schema` url to match the config schema version that is in line with the current install. However you'll receive a command line hint when glossarify-md detects such a situation. See also page Configuration.