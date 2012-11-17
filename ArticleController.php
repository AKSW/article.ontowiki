<?php

class ArticleController extends OntoWiki_Controller_Component
{    
    /**
     * 
     */
    public function editAction () {
        
        // set URL for article extension folder
        $this->view->articleUrl = $this->_config->staticUrlBase . 'article/';
        $this->view->articleJavascriptUrl = $this->_config->staticUrlBase . 'extensions/article/static/javascript/';
        $this->view->articleJavascriptLibrariesUrl = $this->_config->staticUrlBase . 'extensions/article/static/javascript/libraries/';
        $this->view->articleImagesUrl = $this->_config->staticUrlBase . 'extensions/article/static/images/';
        
        // fill title-field
        $this->view->placeholder('main.window.title')->set('Edit an article');
    }
}
