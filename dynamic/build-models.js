/* eslint no-console:0 */
const fs = require('fs');
const yaml = require('js-yaml');
const mkdirp = require('mkdirp');
const path = require('path');

const dataDir = `${__dirname}/../_data/swagger`;

const loadFile = function(file) {
    if (file.endsWith('yaml')) {
        const parsed = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));

        return parsed;
    } else if (file.endsWith('json')) {
        return require(`${file}`);
    }
    console.log(`File extension not recognized: ${file}`); // eslint-disable-line no-console
    return {};
};

const writeHtml = function(dir, modelName, html) {
    mkdirp(dir, (error) => {
        if (error) {
            console.log(error);
            return;
        }
        fs.writeFile(`${dir}/${modelName}.html`, html, function(err) {
            if (err) {
                console.log(err);
            }
        });
    });
};

const buildHtml = function(fileName, parsedContents) {
    const defs = parsedContents.definitions || {};

    Object.keys(defs).forEach((def) => {
        const prettyJson = JSON.stringify(defs[def].example, null, 4);
        const trimmedFilePath = fileName.substr(`${dataDir}/`.length);

        /* used in combination with `fields` to access swagger
         * data linked in _data folder
         */
        let basename = path.basename(trimmedFilePath);

        basename = basename.substr(0, basename.lastIndexOf('.'));

        /* used for bracket notation of dynamic length
         * some key values cannot be accessed by dot notation
         * i.e. trustfile["api.trustfile"]
         */
        let fields = trimmedFilePath.split('/');

        fields.pop();
        fields = `["${fields.join('"]["')}"]["${basename}"]`;

        const product = trimmedFilePath.substr(0, trimmedFilePath.lastIndexOf('/'));
        const siteDir = `${__dirname}/../${product}/models`;

        const html = `---
layout: default
title: "API Console"
api_console: 1
api_name: Avatax REST API v2
nav: apis
product: ${product}
doctype: api_references
endpoint_links: []
---

{% assign name = "${def}" %}
{% assign model_ = site.data.swagger${fields}.definitions[name] %}
{% assign ep = '${prettyJson}' %}

{% include models.html name=name ${(prettyJson) ? 'examplePretty=ep' : ''} model=model_ %}
`;

        writeHtml(siteDir, def, html);
    });
};

const fsReadRecursive = function(fileOrDir) {
    fs.stat(fileOrDir, (error, stats) => {
        if (error) {
            console.log(error);
            return null;
        } else if (stats.isDirectory()) {
            return fs.readdir(fileOrDir, (err, files) => {
                if (err) {
                    console.log(`Could not read directory ${fileOrDir}`);
                    return;
                }
                files.forEach((file) => {
                    fsReadRecursive(`${fileOrDir}/${file}`);
                });
            });
        }
        return buildHtml(fileOrDir, loadFile(fileOrDir));
    });
};

fs.link(`${__dirname}/../dynamic/swagger`, dataDir, function() {
    fsReadRecursive(dataDir);
});
