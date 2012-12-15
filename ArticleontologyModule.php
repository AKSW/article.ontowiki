<?php
/**
 * This file is part of the {@link http://ontowiki.net OntoWiki} project.
 *
 * @copyright Copyright (c) 2012, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */

class ArticleontologyModule extends OntoWiki_Module
{
    /**
     * Label of article resource type
     */
    protected $_newArticleResourceTypeLabel = '';

    public function init ()
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
        
        // get language
        $this->_language = OntoWiki::getInstance()->config->languages->locale;

        // set URLs
        $owUrl                          = $this->_config->staticUrlBase;
        $this->view->owUrl              = $owUrl;
        $this->view->articleUrl         = $owUrl.'article/';
        $this->view->articleCssUrl      = $owUrl.'extensions/article/public/css/';
        $this->view->articleImagesUrl   = $owUrl.'extensions/article/public/images/';

        // get label for newArticleResourceType
        $th = new OntoWiki_Model_TitleHelper();
        $th->addResource($this->_privateConfig->get('newArticleResourceType'));
        $this->_newArticleResourceTypeLabel = $th->getTitle(
            $this->_privateConfig->get('newArticleResourceType'),
            $this->_language
        );
    }

    /**
     * @return string Title of the module container
     */
    public function getTitle()
    {
        return $this->_newArticleResourceTypeLabel;
    }

    /**
     * Show tab only if model is selected and editable
     */
    public function shouldShow()
    {
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
        /**
         * 
         */
        $this->view->headStyle()->prependStyle($this->view->articleCssUrl . 'module/articleontologyModule.css');

        $this->view->rClassLabel = $this->_newArticleResourceTypeLabel;

        return $this->render('public/templates/article/modules/articleontology');
    }
}


