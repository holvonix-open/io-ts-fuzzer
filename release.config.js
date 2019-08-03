/*
### ISC License

Copyright 2019 Holvonix LLC.

Based on https://github.com/conventional-changelog/conventional-changelog/tree/97ad96fe893bd5b40ec52e24fe46f4f9cd357a1a/packages/conventional-changelog-angular :
Copyright © [conventional-changelog team](https://github.com/conventional-changelog)

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
 
*/
const base = require('conventional-changelog-angular');

function writerOpts() {
  return {
    ...base.writerOpts,
    transfom: (commit, context) => {
      const issues = [];

      commit.notes.forEach(note => {
        note.title = `⚠️ BREAKING CHANGES`;
      });

      switch (commit.type) {
        case `feat`:
          commit.type = `🚀 Features`; break;
        case `fix`:
          commit.type = `🐛 Bug Fixes`; break;
        case `perf`:
          commit.type = `🏃 Performance Improvements`; break;
        case `revert`:
          commit.type = `🔙 Reverts`; break;
        case `docs`:
          commit.type = `📖 Documentation`; break;
        case `polish`:
          commit.type = `💄 Polish`; break;
        case `refactor`:
          commit.type = `📦 Code Refactor`; break;
        case `test`:
          commit.type = `🔬 ${ret.type} Tests`; break;
        case `build`:
        case `ci`:
          commit.type = `🔧 Build / Cont. Integration`; break;
        default:
          commit.type = `🎲 Misc.`; break;
      }

      if (commit.scope === `*`) {
        commit.scope = ``;
      }

      if (typeof commit.hash === `string`) {
        commit.hash = commit.hash.substring(0, 7);
      }

      if (typeof commit.subject === `string`) {
        if (commit.subject.indexOf('skip-changelog') >= 0) {
          return;
        }
        let url = context.repository
          ? `${context.host}/${context.owner}/${context.repository}`
          : context.repoUrl;
        if (url) {
          url = `${url}/issues/`;
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue);
            return `[#${issue}](${url}${issue})`;
          });
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
            if (username.includes('/')) {
              return `@${username}`;
            }

            return `[@${username}](${context.host}/${username})`;
          });
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.issue) === -1) {
          return true;
        }

        return false;
      })

      return commit;
    }
  }
};

module.exports = {
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "angular",
        "releaseRules": [
          {
            "type": "perf",
            "release": "patch"
          },
          {
            "type": "refactor",
            "release": "patch"
          },
          {
            "type": "docs",
            "release": "patch"
          },
          {
            "subject": "/skip-release/",
            "release": false
          }
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "writerOpts": writerOpts()
      }
    ],
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        "tarballDir": "npm-dist"
      }
    ],
    "@semantic-release/git",
    [
      "@semantic-release/github",
      {
        "assets": "npm-dist/*.tgz"
      }
    ]
  ]
};
