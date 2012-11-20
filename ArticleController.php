<?php

class ArticleController extends OntoWiki_Controller_Component
{    
    /**
     * 
     */
    public function editAction () {
                
        // set URL for article extension folder
        $this->view->articleUrl = $this->_config->staticUrlBase . 'article/';
        $this->view->articleCssUrl = $this->_config->staticUrlBase . 'extensions/article/static/css/';
        $this->view->articleJavascriptUrl = $this->_config->staticUrlBase . 'extensions/article/static/javascript/';
        $this->view->articleJavascriptLibrariesUrl = $this->_config->staticUrlBase . 'extensions/article/static/javascript/libraries/';
        $this->view->articleImagesUrl = $this->_config->staticUrlBase . 'extensions/article/static/images/';
        
        // fill title-field
        $givenResource = $this->_request->getParam ('r');
        $th = new OntoWiki_Model_TitleHelper ($this->_owApp->selectedModel);
        $th->addResource ( $this->_request->getParam ('r') );
        $this->view->placeholder('main.window.title')
                   ->set('Create an article for \'' . $th->getTitle($givenResource) .'\'' );
    }
}
