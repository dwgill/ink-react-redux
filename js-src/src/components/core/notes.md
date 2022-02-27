# /components/core
- This is intended to store "framework" level components and architecture.
    - The idea is that, if this were a framework, then consumers of the framework shouldn't need to worry about touching anything in here.
- This is in contrast to `/components/ui` which is supposed to be entirely styling, layout, and UI concerns.
    - Consumers of the hypothetical framework would be actively encouraged to customize or replace these components.