<?php

class ArticleHelper extends OntoWiki_Component_Helper
{
    /**
     * 
     */
    public function init()
    {
        //Ontowiki Navigation
        $navigation = OntoWiki::getInstance()->getNavigation();

        // get current request info
        $request  = Zend_Controller_Front::getInstance()->getRequest();
        $controller = $request->getControllerName();
        $action = $request->getActionName();
        
        // set standard priority
        $standardPriority = $this->_privateConfig->get('standardPriority');

        if(($controller == 'article' && $action == 'edit')){
            $standardPriority = 20;
        }
        
        $navigation->register('article', array(
            'controller' => 'article',     
            'action'     => 'edit',        
            'name'       => 'Article',
            'priority'   => $standardPriority
        ));

    }
}
