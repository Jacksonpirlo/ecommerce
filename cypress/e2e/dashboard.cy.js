describe('Dashboard E2E - Video Playback', () => {
    
    beforeEach(() => {
        // 1. Visita la página de login
        cy.visit('/auth/login');
        
        // 2. Llena el formulario
        cy.get('input[name="email"]').type('jacksonflorezp@gmail.com');
        cy.get('input[name="password"]').type('12345');
        
        // 3. Click en el botón de login
        cy.get('button[type="submit"]').click();
        
        // 4. Espera a que redirija al dashboard
        cy.url().should('include', '/dashboard');
    });

    it('Video exist and is visible', () => {
        cy.get('video')
            .should('be.visible')
            .and('have.attr', 'src', 'video.mp4');
    });

    // it('el video tiene los atributos correctos de reproducción', () => {
    //     cy.get('video')
    //         .should('have.attr', 'autoplay')
    //         .and('have.attr', 'loop')
    //         .and('have.attr', 'muted')
    //         .and('have.attr', 'playsinline');
    // });

    it('el video se carga correctamente', () => {
        cy.get('video').should(($video) => {
            const video = $video[0];
            
            // Verifica que el video tiene duración (se cargó)
            expect(video.duration).to.be.greaterThan(0);
            
            // Verifica que no está en estado de error
            expect(video.error).to.be.null;
        });
    });

    it('el video está reproduciéndose (no está pausado)', () => {
        cy.wait(500); // Espera a que autoplay se active
        
        cy.get('video').should(($video) => {
            const video = $video[0];
            
            // Si autoplay funciona, no debe estar pausado
            expect(video.paused).to.be.false;
        });
    });

    it('el video avanza en el tiempo (está rodando)', () => {
        let initialTime;
        
        // Obtén el tiempo inicial
        cy.get('video').then(($video) => {
            initialTime = $video[0].currentTime;
        });
        
        // Espera 2 segundos
        cy.wait(2000);
        
        // Verifica que el tiempo avanzó
        cy.get('video').then(($video) => {
            const currentTime = $video[0].currentTime;
            expect(currentTime).to.be.greaterThan(initialTime);
        });
    });

    it('muestra los textos de bienvenida', () => {
        cy.contains('Bienvenido a plantas bonitas').should('be.visible');
        cy.contains('Pay plants').should('be.visible');
    });

});