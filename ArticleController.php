<?php
/**
 * This file is part of the {@link http://ontowiki.net OntoWiki} project.
 *
 * @copyright Copyright (c) 2012, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */

class ArticleController extends OntoWiki_Controller_Component
{
    protected $_r;
    protected $_rInstance;
    protected $_article;
    protected $_contentProperty;
    protected $_contentDatatype;
    protected $_titleHelper;
    protected $_language;
    protected $_newArticleResourceTypeLabel;

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

        if ("" == $this->getParam('createnew')) {
            // init necessary stuff
            $this->_r = $this->_owApp->selectedResource;
            $this->_rInstance = new Erfurt_Rdf_Resource($this->_r, $this->_owApp->selectedModel);
        } else {
            $this->_r = "";
            $this->_rInstance = null;
        }

        // get language
        $this->_language = OntoWiki::getInstance()->config->languages->locale;

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

        // set URLs
        $owUrl                              = $this->_config->staticUrlBase;
        $this->view->owUrl                  = $owUrl;
        $this->view->articleUrl             = $owUrl.'article/';
        $this->view->articleImagesUrl       = $owUrl.'extensions/article/public/images/';

        // get TitleHelper
        $this->_titleHelper = new OntoWiki_Model_TitleHelper();
        
        // get label for newArticleResourceType
        $th = new OntoWiki_Model_TitleHelper();
        $th->addResource($this->_privateConfig->get('newArticleResourceType'));
        $this->_newArticleResourceTypeLabel = $th->getTitle(
            $this->_privateConfig->get('newArticleResourceType'),
            $this->_language
        );

        /**
         * Set module context
         */
        $this->addModuleContext('extension.resourcemodules.linkinghere');
        $this->addModuleContext('main.window.article.edit');
    }

    /**
     *
     */
    public function editAction ()
    {
        // check whether model is editable
        if (false == $this->_owApp->selectedModel->isEditable()) {
            $this->_owApp->appendMessage(
                new OntoWiki_Message(
                    'No permissions to edit model.',
                    OntoWiki_Message::WARNING
                )
            );
            // disable rendering
            $this->_helper->viewRenderer->setNoRender();
            // stop further execution of the function
            return;
        }
        
        /**
         * Add 2 buttons to the toolbar: save and cancel
         */
        $this->_addButtons($this->_owApp->toolbar);

        $this->_titleHelper->reset();
        
        if (false == $this->_article->getResourceStatus()) {
            $this->_titleHelper->addResource($this->_article->getResourceUri());
        }       
        
        /**
         * Get a bunch of labels
         */
        $this->_titleHelper->addResource($this->_article->getResourceUri());
        
        $this->view->rLabel = $this->_titleHelper->getTitle(
            $this->_article->getResourceUri(),
            $this->_language
        );        
        $this->view->labelLabel = ucwords(
            $this->_titleHelper->getTitle(
                'http://www.w3.org/2000/01/rdf-schema#label',
                $this->_language
            )
        );

        // save given resource
        $this->view->r              = $this->_article->getResourceUri();
        $this->view->rDescription   = $this->_article->getDescriptionText();
           
        if (false == $this->_article->getResourceStatus()) {
            $this->view->placeholder('main.window.title')
               ->set('Set an article for \'' . $this->_titleHelper->getTitle($this->view->r) .'\'');
        }
        else {
            $this->view->placeholder('main.window.title')
               ->set('Add a new '. $this->_newArticleResourceTypeLabel);
        }
        
        /**
         * Include javascript files
         */
        $jsUrl = $this->view->owUrl.'extensions/article/public/javascript/';
        $this->view->headScript()->appendFile($jsUrl .'/BBEditor.js', 'text/javascript');
        $this->view->headScript()->appendFile($jsUrl .'/EditAction.js', 'text/javascript');
        
        $this->view->headScript()->appendFile($jsUrl .'/libraries/showdown.js', 'text/javascript');
        
        /**
         * Include css files
         */
        $cssUrl = $this->view->owUrl.'extensions/article/public/css/';
        $this->view->headLink()->prependStylesheet($cssUrl.'/editAction.css');
    }

    /**
     *
     */
    public function indexAction ()
    {

        // disable OntoWiki's Navigation
        $on = $this->_owApp->getNavigation();
        $on->disableNavigation();

        // set filter
        $instancesconfig = array(
            'filter' => array(array(
                "action" => "add",
                "mode" => "box",
                "id" => "filterboxundefined",
                "property" => $this->_contentProperty,
                "isInverse" => false,
                "propertyLabel" => "Description",
                "filter" => "bound",
                "value1" => null,
                "value2" => null,
                "valuetype" => "literal",
                "literaltype" => null,
                "hidden" => false,
                "negate" => false,
                "objects" => array(array(), null)
            ))
        );

        // redirect to list controller
        $this->_helper->redirector(
            'instances',
            'resource',
            null,
            array(
                'init'            => 1,
                'list'            => 'instances',
                'm'               => urlencode($this->_owApp->selectedModel),
                'instancesconfig' => urlencode(json_encode($instancesconfig))
            )
        );
    }

    /**
     *
     */
    public function savearticleAction()
    {
        // Disable layout
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();

        $this->_article->setLabel($this->_request->getParam('label'));
        $content = $this->_request->getParam('content');

        // Given resource has no article
        if ( false == $this->_article->exists() ) {

            // create article with given $content
            $this->_article->create($content);

            $status = 'ok';
            $message = 'Article created';
        } else {
            // Given resource has already an article
            $this->_article->remove();
            $this->_article->create($content);

            $status = 'ok';
            $message = 'Article updated';
        }

        // check if given resources already has an associated article
        echo json_encode(
            array(
                'status' => $status, 'message' => $message
            )
        );
    }
    
    /**
     * 
     */
    protected function _addButtons(&$toolbar) 
    {
        // creates toolbar and adds two button
        $toolbar->appendButton(
            OntoWiki_Toolbar::SAVE,
            array(
                'name' => 'Save Changes',
                'id' => 'article-Edit-SaveBtn'
            )
        );
        $toolbar->appendButton(
            OntoWiki_Toolbar::CANCEL,
            array(
                'name' => 'Cancel',
                'id' => 'article-CancelBtn'
            )
        );
        
        $this->view->placeholder('main.window.toolbar')->set($toolbar);
    }
}
