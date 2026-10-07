import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resources,subjects,filterResources} from './dist/data.js';
import {coverUrlForIsbn} from './dist/book-covers.js';
test('categories, search, subjects, saved items and related resources agree',()=>{
 for(const [category,type]of [['PYQs','PYQ'],['Books','BOOK'],['Research','RESEARCH'],['E-Resources','E-RESOURCE']]){const found=filterResources({category});assert.ok(found.length);assert.ok(found.every(r=>r.type===type));}
 assert.equal(filterResources().length,resources.length);
 assert.ok(filterResources({query:'  21cs501  '}).every(r=>r.code==='21CS501'));
 assert.equal(filterResources({query:'no-match-123'}).length,0);
 assert.equal(filterResources({saved:[]}).length,0);
 assert.deepEqual(filterResources({saved:['cn-book']}).map(r=>r.id),['cn-book']);
 assert.ok(filterResources({category:'My Subjects',selectedSubjects:[subjects[0].name]}).every(r=>r.subject===subjects[0].name));
 assert.equal(filterResources({category:'My Subjects',selectedSubjects:[]}).length,0);
 for(const r of resources)for(const id of r.related)assert.ok(resources.some(x=>x.id===id));
 for(const book of resources.filter(r=>r.type==='BOOK')){assert.match(book.isbn,/^(?:\d{9}[\dX]|\d{13})$/);assert.equal(new URL(coverUrlForIsbn(book.isbn)).hostname,'covers.openlibrary.org');}
 assert.throws(()=>coverUrlForIsbn('../invalid'),TypeError);
});
