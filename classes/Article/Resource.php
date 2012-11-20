<?php

class Article_Resource
{    
    function __construct ( Erfurt_Rdf_Model $m )
    {
        $this->_m = $m;
    }
        
    /**
     * adds a triple to datastore
     */
    public function add ($s, $p, $o)
    {
        // set type(uri or literal)
        $type = true == Erfurt_Uri::check($o) 
            ? 'uri'
            : 'literal';
        
        // add a triple to datastore
        return $this->_m->addStatement(
            $s,
            $p, 
            array('value' => $o, 'type' => $type)
        );
    }
    
    /**
     * Remove a triple form datastore
     */
    public function remove ($s, $p, $o)
    {
        $options = array();
        $o = '' == $o ? array() : $o;
        
        // set subjecttype(uri or literal)
        if (true == isset($s))
            $options['subject_type'] = true == Erfurt_Uri::check($s)
                ? Erfurt_Store::TYPE_IRI
                : Erfurt_Store::TYPE_LITERAL;
            
        // set type(uri or literal)
        if (true == isset($o) && false == is_array($o))
        {
            $options['object_type'] = true == Erfurt_Uri::check($o)
                ? Erfurt_Store::TYPE_IRI
                : Erfurt_Store::TYPE_LITERAL;
            
            $type = Erfurt_Store::TYPE_IRI == $options['object_type'] 
                ? 'uri'
                : 'literal';
            $o = array('value' => $o, 'type' => $type, 'datatype' => null);
        }
        
        var_dump ( $s );
        
        var_dump ( $p );
        
        var_dump ( $o );
        
        return $this->_m->deleteMatchingStatements(
            $this->_m,
            $s, $p, $o,
            $options
       );
    }
}
