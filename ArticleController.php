<?php

class ArticleController extends OntoWiki_Controller_Component
{    
    public function init () {
        parent::init();
        $loader = Zend_Loader_Autoloader::getInstance();
		$loader->registerNamespace('Article_');
		$path = __DIR__;
		set_include_path(get_include_path() . PATH_SEPARATOR . $path . DIRECTORY_SEPARATOR .'classes' . DIRECTORY_SEPARATOR . PATH_SEPARATOR);
    }
    
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
        
        // save given resource
        $this->view->r = $this->_request->getParam ('r');
        
        /**
         * fill title-field
         */
        $th = new OntoWiki_Model_TitleHelper ($this->_owApp->selectedModel);
        $th->addResource ( $this->view->r );
        $this->view->placeholder('main.window.title')
                   ->set('Create an article for \'' . $th->getTitle($this->view->r) .'\'' );
    }
    
    /**
     * 
     */
    public function savearticleAction () {
        
        /**
         * Disable layout 
         */
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();     
        
        /**
         * 
         */
        
        $content = $this->_request->getParam ('content');
        $r = new Erfurt_Rdf_Resource ( $this->_request->getParam ('r'), $this->_owApp->selectedModel );
        $article = new Article_Article (
            $r,                                             // Resource for article 
            $this->_owApp->selectedModel,                   // current selected model instance  
            'http://purl.org/dc/elements/1.1/description'   // predicate URI between resource and article
        );
                
        /**
         * Given resource has no article
         */
        if ( false == $article->exists () ) {
            
            // create article with given $content
            $article->create ($content);
            
            $status = 'ok';
            $message = 'Article created';
        }
        
        /**
         * Given resource has already an article
         */
        else {
            
            $article->remove ();
            $article->create ($content);
            
            $status = 'ok';
            $message = 'Article updated';
        }
                
        // check if given resources already has an associated article
        echo json_encode (array(
            'status' => $status, 'message' => $message
        ));
    }
}
