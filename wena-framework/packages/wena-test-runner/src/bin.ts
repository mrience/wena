#!/usr/bin/env node
import {$} from 'execa';

const $$ = $({verbose: true, stdio:'inherit'});
await $$`dupa cycki test`;

await $$`jest`;
