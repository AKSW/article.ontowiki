<?php
/**
 * This file is part of the {@link http://ontowiki.net OntoWiki} project.
 *
 * @copyright Copyright (c) 2012, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */

class ArticleontologyModule extends OntoWiki_Module
{

    protected $_r;
    protected $_rInstance;
    protected $_article;
    protected $_contentProperty;
    protected $_contentDatatype;

    public function init()
    {

        parent::init();
        $loader = Zend_Loader_Autoloader::getInstance();
        $loader->registerNamespace('Article_');
        $path = __DIR__;
        set_include_path(
            get_include_path() .
            PATH_SEPARATOR .
            $path .
            DIRECTORY_SEPARATOR .
            'classes' .
            DIRECTORY_SEPARATOR .
            PATH_SEPARATOR
        );

        // get contentProperty from config
        $this->_contentProperty = $this->_privateConfig->get('contentProperty');

        // get contentDatatype from config
        $this->_contentDatatype = $this->_privateConfig->get('contentDatatype');

        // init necessary stuff
        $this->_r = $this->_request->getParam('r');
        $this->_rInstance = new Erfurt_Rdf_Resource(
            $this->_owApp->selectedModel->getModelIri(),
            $this->_owApp->selectedModel
        );

        // get language
        $this->_language = OntoWiki::getInstance()->config->languages->locale;

        // init article instance
        $this->_article = new Article_Article(
            // current selected model instance
            $this->_owApp->selectedModel,
            // predicate URI between resource and article
            $this->_contentProperty,
            // content datatype
            $this->_contentDatatype,
            // article resource type
            $this->_privateConfig->get('newArticleResourceType'),
            // article resource label type
            $this->_privateConfig->get('newArticleResourceLabelType'),
            // language
            $this->_language,
            // Resource for article
            $this->_rInstance
        );
    }

    public function getTitle()
    {
        return 'Article';
    }

    public function shouldShow()
    {
        // Show tab only if model is selected and editable
        $modelIsSelected = null != OntoWiki::getInstance()->selectedModel;

        if (true == $modelIsSelected) {

            $modelIsEditable = OntoWiki::getInstance()->selectedModel->isEditable();

            if (true == $modelIsEditable) {
                return true;
            }
        }

        return false;
    }

    public function getContents()
    {

        // set URLs
        $this->view->owUrl = $this->_config->staticUrlBase;
        $this->view->urimUrl = $this->view->owUrl .'urim/';
        $this->view->articleUrl = $this->_config->staticUrlBase . 'article/';
        $this->view->articleCssUrl =
            $this->_config->staticUrlBase .
            'extensions/article/public/css/';
        $this->view->articleJavascriptUrl =
            $this->_config->staticUrlBase .
            'extensions/article/public/javascript/';
        $this->view->articleJavascriptLibrariesUrl =
            $this->_config->staticUrlBase . 'extensions/article/public/javascript/libraries/';
        $this->view->articleImagesUrl =
            $this->_config->staticUrlBase .
            'extensions/article/public/images/';

        // set model iri and check if model has already an article
        $this->view->selectedModelIri = $this->_owApp->selectedModel->getModelIri();
        $this->view->moduleHasArticle = $this->_article->exists();

        $titleHelper = new OntoWiki_Model_TitleHelper();
        $titleHelper->addResource($this->_privateConfig->get('newArticleResourceType'));
        $this->view->rClassLabel = $titleHelper->getTitle(
            $this->_privateConfig->get('newArticleResourceType'),
            $this->_language
        );

        return $this->render('public/templates/article/modules/articleontology');
    }
}


