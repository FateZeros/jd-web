//确保页面具有有效的标题。
suite('Global Tests', function() {
	test('pags has a valid title', function() {
		assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');
	})
})