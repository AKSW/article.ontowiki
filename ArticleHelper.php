<?php

class ArticleHelper extends OntoWiki_Component_Helper
{
    /**
     * 
     */
    public function init()
    {
        // Show tab only if model is selected and editable
        $modelIsSelected = null != OntoWiki::getInstance()->selectedModel;
        
        if( true == $modelIsSelected ) {
            
            $modelIsEditable = OntoWiki::getInstance()->selectedModel->isEditable();
            
            if ( true == $modelIsEditable  ) {
                //Ontowiki Navigation
                $navigation = OntoWiki::getInstance()->getNavigation();

                // get current request info
                $request  = Zend_Controller_Front::getInstance()->getRequest();
                $controller = $request->getControllerName();
                $action = $request->getActionName();
                
                // set standard priority
                $standardPriority = $this->_privateConfig->get('standardPriority');
                
                $navigation->register('article', array(
                    'controller' => 'article',     
                    'action'     => 'edit',        
                    'name'       => 'Article',
                    'priority'   => $standardPriority
                ));
            }
        }
    }
}
