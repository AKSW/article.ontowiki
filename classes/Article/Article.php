<?php 

class Article_Article {
    
    protected $_m;
    protected $_predicate;
    protected $_datatype;
    protected $_r;
    protected $_rLabel;
    protected $_articleResourceType;
    protected $_articleResourceLabelType;
    protected $_newResource;
    protected $_language;
    
    /**
     * 
     */
    function __construct ( Erfurt_Rdf_Resource $r = null, Erfurt_Rdf_Model $m,
                           $predicate, $datatype, $articleResourceType, $articleResourceLabelType, $language ) {
        $this->_m = $m;
        if (null == $r)
        {
            $this->_r = new Erfurt_Rdf_Resource ($m->createResourceUri(), $m);
            $this->_newResource = true;
        }
        else
        {
            $this->_r = $r;
            $this->_newResource = false;
        }
        
        $this->_predicate = $predicate;
        
        $this->_datatype = $datatype;
        
        $this->_articleResourceType = $articleResourceType;
        $this->_articleResourceLabelType = $articleResourceLabelType;

        $this->_language = $language;
    }
    
    /**
     * Set label of article resource
     */
    public function setLabel( $label ) {
        $this->_rLabel = $label;
    }
    
    /**
     * Add content to given resource
     */
    public function create ( $content ) {
        
        $this->saveResource();
        
        $this->saveResourceLabel();
        
        $this->_m->getStore()->addStatement(
            $this->_m->getModelUri(),
            (string) $this->_r,
            $this->_predicate, 
            array('value' => $content, 'type' => Erfurt_Store::TYPE_LITERAL, 'datatype' => $this->_datatype),
            $useAcl = true
        );
        
        return $this;
    }
    
    /**
     * Save a Resource, if it is not already in store
     */
    public function saveResource () {
        $res = $this->_m->sparqlQuery (
            "SELECT ?p ?o
              WHERE {
                  <". $this->_r->getUri() ."> ?p ?o.
             }
             LIMIT 1;"
        );
        if (0 >= count($res))
        {
            $this->_m->getStore()->addStatement(
                $this->_m->getModelUri(),
                $this->_r->getUri(),
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                array('value' => $this->_articleResourceType, 'type' => 'uri'),
                $useAcl = true
            );
        }
    }
    
    /**
     * Save a Resource, if it is not already in store
     */
    public function saveResourceLabel () {
        // get TitleHelper
        $this->_titleHelper = new OntoWiki_Model_TitleHelper();
        $this->_titleHelper->reset();
        $this->_titleHelper->addResource($this->_r->getUri());
        $oldLabel = $this->_titleHelper->getTitle($this->_r->getUri(), $this->_language);
        
        $res = $this->_m->sparqlQuery (
            "SELECT ?label
              WHERE {
                  <". $this->_r->getUri() ."> <" . $this->_articleResourceLabelType . "> ?label.
             }
             LIMIT 1;"
        );
        if (0 < count($res))
        {
            if ( $oldLabel != $this->_rLabel)
            {
                // delete old label with language tag
                $this->_m->deleteMatchingStatements (
                    $this->_r->getUri(),
                    $this->_articleResourceLabelType,
                    array ( 'value' => $oldLabel, 'type' => Erfurt_Store::TYPE_LITERAL, 'lang' => $this->_language ),
                    array('use_ac' => true)
                );

                // delete old label without language tag
                $this->_m->deleteMatchingStatements (
                    $this->_r->getUri(),
                    $this->_articleResourceLabelType,
                    array ( 'value' => $oldLabel, 'type' => Erfurt_Store::TYPE_LITERAL ),
                    array('use_ac' => true)
                );
                
                // add new label with language tag
                if ("" != $this->_rLabel)
                {
                    // add new label
                    $this->_m->getStore()->addStatement(
                        $this->_m->getModelUri(),
                        $this->_r->getUri(),
                        $this->_articleResourceLabelType,
                        array( 'value' => $this->_rLabel, 'type' => Erfurt_Store::TYPE_LITERAL, 'lang' => $this->_language ),
                        $useAcl = true
                    );
                }
            }
        }
        else
        {
            // if no label is set, set a new one without language tag
            if ("" != $this->_rLabel)
            {
                $this->_m->getStore()->addStatement(
                    $this->_m->getModelUri(),
                    $this->_r->getUri(),
                    $this->_articleResourceLabelType,
                    array( 'value' => $this->_rLabel, 'type' => Erfurt_Store::TYPE_LITERAL ),
                    $useAcl = true
                );
            }
        }
    }
    
    /**
     * Return status of the Resource
     */
    public function getResourceStatus()
    {
        return $this->_newResource;
    }
    
    /**
     * Check if an article for the given resource exists.
     * @return bool true if exists, otherwise false
     */
    public function exists () {
        
        $res = $this->_m->sparqlQuery (
            "SELECT ?s ?p ?o 
              WHERE {
                  ?s ?p ?o.
                  ?s <". $this->_predicate ."> ?o.
                  <". $this->_r ."> <". $this->_predicate ."> ?o.
             }
             LIMIT 1;" 
        );
        
        return 1 > count ( $res ) ? false : true;
    }
    
    /**
     * Get associated article for given resource
     */
    public function get () {
        $res = $this->_m->sparqlQuery (
            "SELECT ?s ?p ?o 
              WHERE {
                  ?s ?p ?o.
                  ?s <". $this->_predicate ."> ?o.
                  <". $this->_r ."> <". $this->_predicate ."> ?o.
             }
             LIMIT 1;" 
        );
        
        return 1 > count ( $res ) ? false : $res [0];
    }
    
    /**
     * Function return the article resource uri
     */
    public function getResourceUri()
    {
        return $this->_r->getUri();
    }
    
    /**
     * Get associated article description text for given resource
     */
    public function getDescriptionText () {
        $d = $this->get();
        
        return $d ['o'];
    }
    
    /**
     * 
     */
    public function getList () {
        $list = $this->_m->sparqlQuery (
            "SELECT ?resource ?content
              WHERE {
                  ?resource ?p ?content.
                  ?resource <". $this->_predicate ."> ?content.
             };" 
        );
        
        $return = array ();
        $th = new OntoWiki_Model_TitleHelper ($this->_m);
        
        foreach ( $list as $entry ) {
            $th->addResource ( $entry ['resource'] );
        }
        
        foreach ( $list as $entry ) {
            $return [] = array (
                'label'     => $th->getTitle ($entry ['resource']),
                'resource'  => $entry ['resource'],
                'content'   => $entry ['content']
            );
        }
        
        return $return;
    }
    
    /**
     * 
     */
    public function remove () {
        
        $result = $this->get ();
        $s = $result ['s']; $p = $result ['p']; 
        $o = array ( 'type' => Erfurt_Store::TYPE_LITERAL, 'value' => $result ['o'] );
        
        // delete without datatype tag
        $this->_m->deleteMatchingStatements ( $s, $p, $o, array('use_ac' => true) );
        
        // delete with datatype tag
        $o['datatype'] = $this->_datatype;
        $this->_m->deleteMatchingStatements ( $s, $p, $o, array('use_ac' => true) );
        
        return $this;
    }
}
