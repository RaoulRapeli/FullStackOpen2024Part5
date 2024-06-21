describe('Blog ', function() {
  describe('Blog app', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
        name: 'Raoul Rapeli',
        username: 'RaoulRapeli',
        password: 'salainen'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user) 
      cy.visit('http://localhost:5173')
    })
  
    it('Login form is shown', function() {
      cy.contains('Log in to application')
    })

    describe('Login',function() {
      it('succeeds with correct credentials', function() {
        cy.get('#username').type('RaoulRapeli')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()
        cy.contains('Raoul Rapeli logged in')
      })
  
      it('fails with wrong credentials', function() {
        cy.get('#username').type('RaoulRapeli')
        cy.get('#password').type('salainen1')
        cy.get('#login-button').click()
        cy.contains('wrong username or password')
      })
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.visit('http://localhost:5173')
      cy.contains('Log in to application')
      cy.get('#username').type('RaoulRapeli')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Raoul Rapeli logged in')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#titleInput').type('Testing 33')
      cy.get('#authorInput').type('RMR')
      cy.get('#urlInput').type('google.com')
      cy.get('#createBlogButton').click()
      cy.get('.blogList').contains('Testing 33 RMR')
    })

    it('Like a blog', function() {
      cy.contains('view').click()
      cy.contains('like').click()
      cy.get('.amountOfLikes').contains('1')
    })

    it('Can user remove blog', function() {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('blog Testing 33 by RMR has been removed')
    })

    it('Only blog creator can remove the blog', function() {
      cy.contains('new blog').click()
      cy.get('#titleInput').type('Testing 33')
      cy.get('#authorInput').type('RMR')
      cy.get('#urlInput').type('google.com')
      cy.get('#createBlogButton').click()
      cy.contains('logout').click()
      const user = {
        name: 'Raoul Rapeli2',
        username: 'RaoulRapeli2',
        password: 'salainen2'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.get('#username').type('RaoulRapeli2')
      cy.get('#password').type('salainen2')
      cy.get('#login-button').click()
      cy.contains('view').click()
      cy.contains("remove").should('not.exist')
    })
    it('Only blog creator can remove the blog', function() {
      cy.contains('logout').click()
      cy.get('#username').type('RaoulRapeli2')
      cy.get('#password').type('salainen2')
      cy.get('#login-button').click()
      cy.contains('new blog').click()
      cy.get('#titleInput').type('Testing 34')
      cy.get('#authorInput').type('RMR4')
      cy.get('#urlInput').type('google.com')
      cy.get('#createBlogButton').click()
      cy.contains('new blog').click()
      cy.get('#titleInput').type('Testing 35')
      cy.get('#authorInput').type('RMR5')
      cy.get('#urlInput').type('google.com')
      cy.get('#createBlogButton').click()
      cy.contains("view").click()
      cy.contains("view").click()
      cy.contains("view").click()
      const firstButton = cy.get(".likeButton").first()
      firstButton.click().wait(500).then(()=>{
        return firstButton.click()
      }).wait(500).then(()=>{
        return firstButton.click()
      }).wait(500).then(()=>{
        return firstButton.click()
      }).wait(500).then(()=>{
        return firstButton.click()
      })
      const lastButton = cy.get(".likeButton").last()
      lastButton.click().wait(500).then(()=>{
        return lastButton.click()
      }).wait(500).then(()=>{
        return lastButton.click()
      }).wait(500).then(()=>{
        return lastButton.click()
      }).wait(500).then(()=>{
        return lastButton.click()
      }).wait(500).then(()=>{
        return lastButton.click()
      }).wait(500).then(()=>{
        return lastButton.click()
      }).wait(500).then(()=>{
        return lastButton.click()
      }).then(()=>{
        cy.get('.amountOfLikes').eq(0).invoke('text').then(($firstText)=>{
          const $firstValue = parseInt($firstText)
          cy.get('.amountOfLikes').eq(1).invoke('text').then(($secondText)=>{
            const $secondtValue = parseInt($secondText)
            expect($firstValue).to.gt($secondtValue)
          })
        })
        cy.get('.amountOfLikes').eq(1).invoke('text').then(($firstText)=>{
          const $firstValue = parseInt($firstText)
          cy.get('.amountOfLikes').eq(2).invoke('text').then(($secondText)=>{
            const $secondtValue = parseInt($secondText)
            expect($firstValue).to.gt($secondtValue)
          })
        })
      })
    })
  })
})