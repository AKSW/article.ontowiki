<?php

class ArticleController extends OntoWiki_Controller_Component
{
    /**
     * 
     */
    public function init()
    {
        
    }
    
    /**
     * 
     */
    public function editAction () {
        
        // fill title-field
        $this->view->placeholder('main.window.title')->set('Edit an article' );
    }
}
