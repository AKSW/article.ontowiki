<?php

class ArticleontologyModule extends OntoWiki_Module {

    protected $_r;
    protected $_rInstance;
    protected $_article;

    public function init() {
        
        parent::init();
        $loader = Zend_Loader_Autoloader::getInstance();
        $loader->registerNamespace('Article_');
        $path = __DIR__;
        set_include_path(get_include_path() . PATH_SEPARATOR . $path . DIRECTORY_SEPARATOR .'classes' . DIRECTORY_SEPARATOR . PATH_SEPARATOR);
        
        // init necessary stuff
        $this->_r = $this->_request->getParam ('r');
        $this->_rInstance = new Erfurt_Rdf_Resource ( 
            $this->_owApp->selectedModel->getModelIri(), 
            $this->_owApp->selectedModel 
        );
        $this->_article = new Article_Article (
            $this->_rInstance,                              // Resource for article 
            $this->_owApp->selectedModel,                   // current selected model instance  
            'http://purl.org/dc/elements/1.1/description'   // predicate URI between resource and article
        ); 
    }

    public function getTitle() {
        return 'Article';
    }
    
    public function shouldShow(){
        return true;
    }

    public function getContents() {
        
        // set URLs
        $this->view->owUrl = $this->_config->staticUrlBase;
        $this->view->urimUrl = $this->view->owUrl .'urim/';
        $this->view->articleUrl = $this->_config->staticUrlBase . 'article/';
        $this->view->articleCssUrl = $this->_config->staticUrlBase . 'extensions/article/static/css/';
        $this->view->articleJavascriptUrl = $this->_config->staticUrlBase . 'extensions/article/static/javascript/';
        $this->view->articleJavascriptLibrariesUrl = $this->_config->staticUrlBase . 'extensions/article/static/javascript/libraries/';
        $this->view->articleImagesUrl = $this->_config->staticUrlBase . 'extensions/article/static/images/';
        
        // set model iri and check if model has already an article
        $this->view->selectedModelIri = $this->_owApp->selectedModel->getModelIri();        
        $this->view->moduleHasArticle = $this->_article->exists();
        
        return $this->render('static/templates/article/modules/articleontology');
    }

}

