<?php

class ArticleController extends OntoWiki_Controller_Component
{
    /**
     * 
     */
    public function init()
    {
        
    }
    
    function curPageURL() {
        $pageURL = 'http';
        
        if (true == isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
        $pageURL .= "://";
        
        if ($_SERVER["SERVER_PORT"] != "80") {
            $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
        } else {
            $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
        }
        return $pageURL;
    }
    
    /**
     * 
     */
    public function editAction () {
        
        $currentUri = substr ( $this->curPageURL(), 0, strpos ( $this->curPageURL(), 'article/edit/' ));
        $this->view->articlePath = $currentUri . 'article/';
        
        $this->view->staticUrlBase = $currentUri;
        $this->view->themeExtraStyles = array ();
        
        $this->view->themeUrlBase = $currentUri .'extensions/themes/silverblue/';
        $this->view->libraryUrlBase = $this->view->themeUrlBase .'scripts/libraries';
        
        
        // fill title-field
        // $this->view->placeholder('main.window.title')->set('Edit an article');
    }
}
