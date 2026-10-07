import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resources,subjects,filterResources,searchBooksByTopic,getBookAvailability} from './dist/data.js';
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
 const ds=searchBooksByTopic('Data Structures');
 assert.equal(ds.length,5);
 assert.equal(ds[0].id,'ds-book');
 assert.ok(ds.every(book=>book.type==='BOOK'&&book.matchedTopics.includes('Data Structures')));
 assert.ok(ds.slice(0,3).every(book=>book.subject==='Data Structures'));
 assert.ok(ds.some(book=>book.id==='db-book')&&ds.some(book=>book.id==='os-book'));
 assert.deepEqual(searchBooksByTopic(' DS ').map(book=>book.id),ds.map(book=>book.id));
 assert.deepEqual(searchBooksByTopic('dsa').map(book=>book.id),ds.map(book=>book.id));
 assert.ok(searchBooksByTopic('hash tables').some(book=>book.id==='db-book'));
 assert.ok(searchBooksByTopic('binary trees').every(book=>book.topics.includes('Binary Search Trees')));
 assert.ok(searchBooksByTopic('trees and hashing').every(book=>book.topics.some(topic=>topic.includes('Trees'))&&book.topics.includes('Hashing')));
 assert.equal(searchBooksByTopic('quantum potatoes').length,0);
 assert.equal(searchBooksByTopic(' ').length,0);
 assert.equal(searchBooksByTopic('<script>alert(1)</script>').length,0);
 assert.ok(filterResources({category:'Books',query:'hashing'}).some(book=>book.id==='db-book'));
 for(const book of resources.filter(r=>r.type==='BOOK')){const stock=getBookAvailability(book);assert.notEqual(stock.status,'unknown');assert.ok(stock.available<=stock.total);assert.equal(book.holdings.source,'demo');for(const value of [book.holdings.library,book.holdings.floor,book.holdings.section,book.rack,book.shelf,book.callNumber])assert.ok(value);}
 assert.equal(getBookAvailability(resources.find(r=>r.id==='ds-book')).status,'available');
 assert.equal(getBookAvailability(resources.find(r=>r.id==='os-book')).status,'unavailable');
 assert.equal(getBookAvailability(resources.find(r=>r.id==='algorithms-book')).status,'reference');
 assert.equal(getBookAvailability({}).status,'unknown');
 for(const [availableCopies,totalCopies]of [[-1,3],[4,3],['2',3],[1,0]])assert.equal(getBookAvailability({holdings:{availableCopies,totalCopies,loanPolicy:'borrow'}}).status,'unknown');
});
