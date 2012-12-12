<?php

class ArticleController extends OntoWiki_Controller_Component
{    
    protected $_r;
    protected $_rInstance;
    protected $_article;
    protected $_contentProperty;
    protected $_contentDatatype;
    protected $_titleHelper;
    protected $_language;
    
    public function init () {
        parent::init();
        $loader = Zend_Loader_Autoloader::getInstance();
        $loader->registerNamespace('Article_');
        $path = __DIR__;
        set_include_path(get_include_path() . PATH_SEPARATOR . $path . DIRECTORY_SEPARATOR .'classes' . DIRECTORY_SEPARATOR . PATH_SEPARATOR);
        
        // get contentProperty from config
        $this->_contentProperty = $this->_privateConfig->get('contentProperty');
        
        // get contentDatatype from config
        $this->_contentDatatype = $this->_privateConfig->get('contentDatatype');
        
        if ("" == $this->getParam('createnew')) {
            // init necessary stuff
            $this->_r = $this->_owApp->selectedResource;
            $this->_rInstance = new Erfurt_Rdf_Resource ( $this->_r, $this->_owApp->selectedModel );
        } else {
            $this->_r = "";
            $this->_rInstance = null;
        }
            
        // get language
        $this->_language = OntoWiki::getInstance()->config->languages->locale;
        
        $this->_article = new Article_Article (
            $this->_rInstance,                                          // Resource for article 
            $this->_owApp->selectedModel,                               // current selected model instance  
            $this->_contentProperty,                                    // predicate URI between resource and article,
            $this->_contentDatatype,                                    // content datatype
            $this->_privateConfig->get('newArticleResourceType'),       // article resource type
            $this->_privateConfig->get('newArticleResourceLabelType'),  // article resource label type
            $this->_language                                            // language
        );        
        
        // set URLs
        $this->view->owUrl = $this->_config->staticUrlBase;
        $this->view->articleUrl = $this->_config->staticUrlBase . 'article/';
        $this->view->articleCssUrl = $this->_config->staticUrlBase . 'extensions/article/public/css/';
        $this->view->articleJavascriptUrl = $this->_config->staticUrlBase . 'extensions/article/public/javascript/';
        $this->view->articleJavascriptLibrariesUrl = $this->_config->staticUrlBase . 'extensions/article/public/javascript/libraries/';
        $this->view->articleImagesUrl = $this->_config->staticUrlBase . 'extensions/article/public/images/';
        
        // get TitleHelper
        $this->_titleHelper = new OntoWiki_Model_TitleHelper();
        
    }
    
    /**
     * 
     */
    public function editAction () {

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
        }
        else
        {
            // fire module context
            $this->addModuleContext('extension.resourcemodules.linkinghere');
            $this->addModuleContext('main.window.article.edit');

            // save given resource
            $this->view->r = $this->_article->getResourceUri();
            
            // get resource label and label of label property
            $this->_titleHelper->reset();
            $this->_titleHelper->addResource($this->_article->getResourceUri());
            $this->_titleHelper->addResource($this->_privateConfig->get('newArticleResourceType'));
            $this->view->rLabel = $this->_titleHelper->getTitle($this->_article->getResourceUri(), $this->_language);
            $this->view->labelLabel = $this->_titleHelper->getTitle('http://www.w3.org/2000/01/rdf-schema#label', $this->_language);
            $this->view->labelLabel = ucwords ($this->view->labelLabel);
            
            
            // save given resource
            $this->view->rDescription = $this->_article->getDescriptionText();
            
            if (false == $this->_article->getResourceStatus())
            {
                /**
                 * fill title-field
                 */
                $th = new OntoWiki_Model_TitleHelper ($this->_owApp->selectedModel);
                $th->addResource ( $this->view->r );
                $this->view->placeholder('main.window.title')
                           ->set('Set an article for \'' . $th->getTitle($this->view->r) .'\'' );
            }
            else
                $this->view->placeholder('main.window.title')
                           ->set('Add a new article' );
        }
    }
    
    /**
     * 
     */
    public function indexAction () {
                
        // disable OntoWiki's Navigation
        $on = $this->_owApp->getNavigation();
        $on->disableNavigation ();
        
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
    public function savearticleAction () {
        
        /**
         * Disable layout 
         */
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();     
        
        /**
         * 
         */

        $this->_article->setLabel($this->_request->getParam ('label'));
        $content = $this->_request->getParam ('content');
                
        /**
         * Given resource has no article
         */
        if ( false == $this->_article->exists () ) {
            
            // create article with given $content
            $this->_article->create ($content);
            
            $status = 'ok';
            $message = 'Article created';
        }
        
        /**
         * Given resource has already an article
         */
        else {
            
            $this->_article->remove ();
            $this->_article->create ($content);
            
            $status = 'ok';
            $message = 'Article updated';
        }
                
        // check if given resources already has an associated article
        echo json_encode (array(
            'status' => $status, 'message' => $message
        ));
    }
}
