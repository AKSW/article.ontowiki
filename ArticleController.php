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

        if ('' == $this->getParam('createnew')) {
            // init necessary stuff
            $this->_r = $this->_owApp->selectedResource->getUri();
            $this->_rInstance = new Erfurt_Rdf_Resource($this->_r, $this->_owApp->selectedModel);
        } else {
            // Generate a special uri for the new resource
            // This uri contains "NewResource/" and because of that the 
            // plugin "resourcecreationuri" will recognize this and replace
            // the uri with a "beautiful" one.
            $this->_r = $this->_owApp->selectedModel->getModelIri() 
                .'NewResource/'. strtoupper(md5(rand(0, 1000)*time()));
            $this->_rInstance = null;
        }

        // get language
        $this->_language = OntoWiki::getInstance()->config->languages->locale;
        
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
        // these two contexts pull a specific module into the view
        $this->addModuleContext('extension.resourcemodules.linkinghere');
        $this->addModuleContext('extension.pubsub.subscriptions');
        // this context provides a generic view identifier
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
         * Model
         */
        $model = $this->_owApp->selectedModel;
        $modelIri = $this->_owApp->selectedModel->getModelIri();
        
        // article resource type
        $newArticleResourceType = $this->_privateConfig->get('newArticleResourceType');
        
        // article resource label type
        $newArticleResourceLabelType = $this->_privateConfig->get('newArticleResourceLabelType');
        
        /**
         * Add 2 buttons to the toolbar: save and cancel
         */
        $this->_addButtons($this->_owApp->toolbar);

        $this->_titleHelper->reset();

        /**
         * if resource EXISTS already
         */
        if(null != $this->_rInstance) {
            $resource = new OntoWiki_Model_Resource($model->getStore(), $model, $this->_r);
            
            $resource = $resource->getValues();
            $resource = $resource[$modelIri];            
            
            $articleData = array (
                'r'                         => $this->_r,
                'rLabel'                    => $resource[$this->_privateConfig->get('newArticleResourceLabelType')][0]['content'],
                'rDescription'              => $resource[$this->_privateConfig->get('contentProperty')][0]['content'],
                'articleUrl'                => $this->view->articleUrl,
                'articleImagesUrl'          => $this->view->articleImagesUrl,
                'insertUpdateInformation'   => array(
                    'newResourceTypeUri'    => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                    'newResourceClassUri'   => $this->_privateConfig->get('newArticleResourceType'),
                    'namedGraphUri'         => $modelIri,
                    'serviceUpdateURL'      => $this->view->owUrl . 'service/update/',
                    'contentPropertyUri'    => $this->_contentProperty,
                    'contentDatatype'       => $this->_contentDatatype,
                    'resourceLabelUri'      => $this->_privateConfig->get('newArticleResourceLabelType'),
                    'resourceLabelDataType' => $resource[$newArticleResourceLabelType][0]['datatype'],
                    'resourceLabelLang'     => $resource[$newArticleResourceLabelType][0]['lang'],
                )
            );            
            
            // site window title
            $this->view->placeholder('main.window.title')
               ->set('Set an article for \'' . $this->view->rLabel .'\'');
        
        
        /**
         * if resource does NOT exists yet.
         */
        } else {
            $articleData = array (
                'r'                         => $this->_r,
                'rLabel'                    => '',
                'rDescription'              => '',
                'articleUrl'                => $this->view->articleUrl,
                'articleImagesUrl'          => $this->view->articleImagesUrl,
                'insertUpdateInformation'   => array(
                    'newResourceTypeUri'    => 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                    'newResourceClassUri'   => $this->_privateConfig->get('newArticleResourceType'),
                    'namedGraphUri'         => $modelIri,
                    'serviceUpdateURL'      => $this->view->owUrl . 'service/update/',
                    'contentPropertyUri'    => $this->_contentProperty,
                    'contentDatatype'       => $this->_contentDatatype,
                    'resourceLabelUri'      => $this->_privateConfig->get('newArticleResourceLabelType'),
                    'resourceLabelDataType' => '',
                    'resourceLabelLang'     => '',
                )
            );               
            
            // site window title
            $this->view->placeholder('main.window.title')
               ->set('Add a new '. $this->_newArticleResourceTypeLabel);
        }
        
        /**
         * Configuration for our bbeditor
         */
        $bbEditorConfiguration = array(
            'textareaId'    => 'article-Edit-EditorContent', 
            'toolbarId'     => 'article-Edit-Toolbar',
            
            // List of element which will be shown in the toolbar in the given order
            'toolbarEntries' => array(
                array('image' => 'boldB.png', 'name' => 'boldBtn', 'title' => 'Bold', 'type' => 'bold'),
                array('image' => 'italicI.png', 'name' => 'italicBtn', 'title' => 'Italic', 'type' => 'italic'),
                array('image' => 'codeLine.png', 'name' => 'codeLineBtn', 'title' => 'Code line', 'type' => 'codeLine'),
                array('image' => 'codeBlock.png', 'name' => 'codeBlockBtn', 'title' => 'Code block', 'type' => 'codeBlock'),
                array('image' => 'list.png', 'name' => 'listBtn', 'title' => 'Unordered list', 'type' => 'list'),
                array('image' => 'quote.png', 'name' => 'quoteBtn', 'title' => 'Quoting text', 'type' => 'quote')
            )
        );
        
        $articleData ['BBEditor'] = $bbEditorConfiguration;
        
        $this->view->articleData = $articleData;
        

        /**
         * Get a bunch of labels
         */
        
        $this->view->labelLabel = ucwords(
            $this->_titleHelper->getTitle(
                'http://www.w3.org/2000/01/rdf-schema#label',
                $this->_language
            )
        );

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
