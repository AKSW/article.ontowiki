<?php

class ArticleController extends OntoWiki_Controller_Component
{    
    protected $_r;
    protected $_rInstance;
    protected $_article;
    protected $_contentProperty;
    
    public function init () {
        parent::init();
        $loader = Zend_Loader_Autoloader::getInstance();
        $loader->registerNamespace('Article_');
        $path = __DIR__;
        set_include_path(get_include_path() . PATH_SEPARATOR . $path . DIRECTORY_SEPARATOR .'classes' . DIRECTORY_SEPARATOR . PATH_SEPARATOR);
        
        // get contentProperty from config
        $this->_contentProperty = $this->_privateConfig->get('contentProperty');
        
        // init necessary stuff
        $this->_r = $this->_request->getParam ('r');
        $this->_rInstance = new Erfurt_Rdf_Resource ( $this->_request->getParam ('r'), $this->_owApp->selectedModel );
        $this->_article = new Article_Article (
            $this->_rInstance,                              // Resource for article 
            $this->_owApp->selectedModel,                   // current selected model instance  
            $this->_contentProperty                         // predicate URI between resource and article
        );        
        
        // set URLs
        $this->view->owUrl = $this->_config->staticUrlBase;
        $this->view->urimUrl = $this->view->owUrl .'urim/';
        $this->view->articleUrl = $this->_config->staticUrlBase . 'article/';
        $this->view->articleCssUrl = $this->_config->staticUrlBase . 'extensions/article/static/css/';
        $this->view->articleJavascriptUrl = $this->_config->staticUrlBase . 'extensions/article/static/javascript/';
        $this->view->articleJavascriptLibrariesUrl = $this->_config->staticUrlBase . 'extensions/article/static/javascript/libraries/';
        $this->view->articleImagesUrl = $this->_config->staticUrlBase . 'extensions/article/static/images/';
    }
    
    /**
     * 
     */
    public function editAction () {
                
        // save given resource
        $this->view->r = $this->_r;
        
        // save given resource
        $this->view->rDescription = $this->_article->getDescriptionText();
        
        /**
         * fill title-field
         */
        $th = new OntoWiki_Model_TitleHelper ($this->_owApp->selectedModel);
        $th->addResource ( $this->view->r );
        $this->view->placeholder('main.window.title')
                   ->set('Set an article for \'' . $th->getTitle($this->view->r) .'\'' );
    }
    
    /**
     * 
     */
    public function indexAction () {
                
        // disable OntoWiki's Navigation
        $on = $this->_owApp->getNavigation();
        $on->disableNavigation ();
        
        // set window title
        $th = new OntoWiki_Model_TitleHelper ($this->_owApp->selectedModel);
        $modelLabel = $th->addResource ($this->_owApp->selectedModel->getModelIri())
                         ->getTitle ($this->_owApp->selectedModel->getModelIri());
        $this->view->placeholder('main.window.title')
                   ->set('Article list of model \''. $modelLabel .'\'' );
        
        // load article list
        $this->view->articleList = $this->_article->getList ();
        
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
            $this->_contentProperty                         // predicate URI between resource and article
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
