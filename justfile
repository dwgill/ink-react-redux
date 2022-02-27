INK_DIR := "./ink-src"
APP_DIR := "./js-src"
INK_COMPILER_DIR := "./inkjs"
INK_COMPILER_SCRIPT := INK_COMPILER_DIR + "/dist/inklecate.js"
INK_COMPILER_OUTPUT := APP_DIR + "/src/state/story/inkStory.json"
INK_COMPILER_INPUT := INK_DIR + "/main.ink"

default: dev

install-deps param="noforce": (install-js-src-deps param) (install-inkjs-deps param)

install-js-src-deps param="noforce":
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ "force" == '{{param}}' || ! -d "{{APP_DIR}}/node_modules" ]]; then
        echo 'Installing dependencies for {{APP_DIR}}'
        cd {{APP_DIR}} && npm ci
    else
        echo 'Skipping dependency installation for {{APP_DIR}}'
    fi

install-inkjs-deps param="noforce":
    #!/usr/bin/env bash
    set -euo pipefail
    if [[ "force" == '{{param}}' || ! -d "{{INK_COMPILER_DIR}}/node_modules" ]]; then
        echo 'Installing dependencies for {{INK_COMPILER_DIR}}'
        cd {{INK_COMPILER_DIR}} && npm ci
    else
        echo 'Skipping dependency installation for {{INK_COMPILER_DIR}}'
    fi

compile-ink-src: install-inkjs-deps
    node {{INK_COMPILER_SCRIPT}} -o {{INK_COMPILER_OUTPUT}} {{INK_COMPILER_INPUT}}

app-dev: compile-ink-src install-js-src-deps
    cd {{APP_DIR}} && npm run start
    
watch-ink-src:
    cd {{INK_DIR}} && watchexec -e ink just compile-ink-src

dev:
    just watch-ink-src & just app-dev