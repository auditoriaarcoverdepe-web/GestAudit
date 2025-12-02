e x p o r t   t y p e   J s o n   =  
     |   s t r i n g  
     |   n u m b e r  
     |   b o o l e a n  
     |   n u l l  
     |   {   [ k e y :   s t r i n g ] :   J s o n   |   u n d e f i n e d   }  
     |   J s o n [ ]  
  
 e x p o r t   t y p e   D a t a b a s e   =   {  
     / /   A l l o w s   t o   a u t o m a t i c a l l y   i n s t a n t i a t e   c r e a t e C l i e n t   w i t h   r i g h t   o p t i o n s  
     / /   i n s t e a d   o f   c r e a t e C l i e n t < D a t a b a s e ,   {   P o s t g r e s t V e r s i o n :   ' X X '   } > ( U R L ,   K E Y )  
     _ _ I n t e r n a l S u p a b a s e :   {  
         P o s t g r e s t V e r s i o n :   " 1 3 . 0 . 5 "  
     }  
     p u b l i c :   {  
         T a b l e s :   {  
             a u d i t _ s t a g e s :   {  
                 R o w :   {  
                     a c t u a l e n d d a t e :   s t r i n g   |   n u l l  
                     a c t u a l s t a r t d a t e :   s t r i n g   |   n u l l  
                     a u d i t i d :   s t r i n g  
                     c r e a t e d _ a t :   s t r i n g   |   n u l l  
                     i d :   s t r i n g  
                     n a m e :   s t r i n g  
                     n o t e s :   s t r i n g   |   n u l l  
                     p l a n n e d e n d d a t e :   s t r i n g  
                     p l a n n e d s t a r t d a t e :   s t r i n g  
                     r e s p o n s i b l e :   s t r i n g   |   n u l l  
                     s t a t u s :   s t r i n g  
                 }  
                 I n s e r t :   {  
                     a c t u a l e n d d a t e ? :   s t r i n g   |   n u l l  
                     a c t u a l s t a r t d a t e ? :   s t r i n g   |   n u l l  
                     a u d i t i d :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     i d :   s t r i n g  
                     n a m e :   s t r i n g  
                     n o t e s ? :   s t r i n g   |   n u l l  
                     p l a n n e d e n d d a t e :   s t r i n g  
                     p l a n n e d s t a r t d a t e :   s t r i n g  
                     r e s p o n s i b l e ? :   s t r i n g   |   n u l l  
                     s t a t u s :   s t r i n g  
                 }  
                 U p d a t e :   {  
                     a c t u a l e n d d a t e ? :   s t r i n g   |   n u l l  
                     a c t u a l s t a r t d a t e ? :   s t r i n g   |   n u l l  
                     a u d i t i d ? :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     i d ? :   s t r i n g  
                     n a m e ? :   s t r i n g  
                     n o t e s ? :   s t r i n g   |   n u l l  
                     p l a n n e d e n d d a t e ? :   s t r i n g  
                     p l a n n e d s t a r t d a t e ? :   s t r i n g  
                     r e s p o n s i b l e ? :   s t r i n g   |   n u l l  
                     s t a t u s ? :   s t r i n g  
                 }  
                 R e l a t i o n s h i p s :   [  
                     {  
                         f o r e i g n K e y N a m e :   " a u d i t _ s t a g e s _ a u d i t i d _ f k e y "  
                         c o l u m n s :   [ " a u d i t i d " ]  
                         i s O n e T o O n e :   f a l s e  
                         r e f e r e n c e d R e l a t i o n :   " a u d i t s "  
                         r e f e r e n c e d C o l u m n s :   [ " i d " ]  
                     } ,  
                 ]  
             }  
             a u d i t s :   {  
                 R o w :   {  
                     a c t u a l e n d d a t e :   s t r i n g   |   n u l l  
                     a c t u a l s t a r t d a t e :   s t r i n g   |   n u l l  
                     a u d i t e d s e c t o r :   s t r i n g   |   n u l l  
                     a u d i t n u m b e r :   s t r i n g  
                     a u d i t o r n o t e s :   s t r i n g   |   n u l l  
                     c r i t e r i a :   s t r i n g   |   n u l l  
                     c r e a t e d _ a t :   s t r i n g   |   n u l l  
                     i d :   s t r i n g  
                     i n s t i t u t i o n i d :   s t r i n g  
                     o b j e c t i v e :   s t r i n g   |   n u l l  
                     p l a n n e d e n d d a t e :   s t r i n g  
                     p l a n n e d s t a r t d a t e :   s t r i n g  
                     p r i o r i t y :   s t r i n g  
                     s c o p e :   s t r i n g   |   n u l l  
                     s e c t o r r e s p o n s i b l e :   s t r i n g   |   n u l l  
                     s t a t u s :   s t r i n g  
                     t i t l e :   s t r i n g  
                     t y p e :   s t r i n g  
                     y e a r :   n u m b e r  
                 }  
                 I n s e r t :   {  
                     a c t u a l e n d d a t e ? :   s t r i n g   |   n u l l  
                     a c t u a l s t a r t d a t e ? :   s t r i n g   |   n u l l  
                     a u d i t e d s e c t o r ? :   s t r i n g   |   n u l l  
                     a u d i t n u m b e r :   s t r i n g  
                     a u d i t o r n o t e s ? :   s t r i n g   |   n u l l  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     c r i t e r i a ? :   s t r i n g   |   n u l l  
                     i d :   s t r i n g  
                     i n s t i t u t i o n i d :   s t r i n g  
                     o b j e c t i v e ? :   s t r i n g   |   n u l l  
                     p l a n n e d e n d d a t e :   s t r i n g  
                     p l a n n e d s t a r t d a t e :   s t r i n g  
                     p r i o r i t y :   s t r i n g  
                     s c o p e ? :   s t r i n g   |   n u l l  
                     s e c t o r r e s p o n s i b l e ? :   s t r i n g   |   n u l l  
                     s t a t u s :   s t r i n g  
                     t i t l e :   s t r i n g  
                     t y p e :   s t r i n g  
                     y e a r :   n u m b e r  
                 }  
                 U p d a t e :   {  
                     a c t u a l e n d d a t e ? :   s t r i n g   |   n u l l  
                     a c t u a l s t a r t d a t e ? :   s t r i n g   |   n u l l  
                     a u d i t e d s e c t o r ? :   s t r i n g   |   n u l l  
                     a u d i t n u m b e r ? :   s t r i n g  
                     a u d i t o r n o t e s ? :   s t r i n g   |   n u l l  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     c r i t e r i a ? :   s t r i n g   |   n u l l  
                     i d ? :   s t r i n g  
                     i n s t i t u t i o n i d ? :   s t r i n g  
                     o b j e c t i v e ? :   s t r i n g   |   n u l l  
                     p l a n n e d e n d d a t e ? :   s t r i n g  
                     p l a n n e d s t a r t d a t e ? :   s t r i n g  
                     p r i o r i t y ? :   s t r i n g  
                     s c o p e ? :   s t r i n g   |   n u l l  
                     s e c t o r r e s p o n s i b l e ? :   s t r i n g   |   n u l l  
                     s t a t u s ? :   s t r i n g  
                     t i t l e ? :   s t r i n g  
                     t y p e ? :   s t r i n g  
                     y e a r ? :   n u m b e r  
                 }  
                 R e l a t i o n s h i p s :   [  
                     {  
                         f o r e i g n K e y N a m e :   " a u d i t s _ i n s t i t u t i o n i d _ f k e y "  
                         c o l u m n s :   [ " i n s t i t u t i o n i d " ]  
                         i s O n e T o O n e :   f a l s e  
                         r e f e r e n c e d R e l a t i o n :   " i n s t i t u t i o n s "  
                         r e f e r e n c e d C o l u m n s :   [ " i d " ]  
                     } ,  
                 ]  
             }  
             f i n d i n g s :   {  
                 R o w :   {  
                     a t t a c h m e n t s :   J s o n   |   n u l l  
                     a u d i t i d :   s t r i n g  
                     c a u s e :   s t r i n g  
                     c l a s s i f i c a t i o n :   s t r i n g  
                     c r e a t e d _ a t :   s t r i n g   |   n u l l  
                     e f f e c t :   s t r i n g  
                     e v i d e n c e :   s t r i n g  
                     f i n d i n g c o d e :   s t r i n g  
                     i d :   s t r i n g  
                     s t a t u s :   s t r i n g  
                     s u m m a r y :   s t r i n g  
                     v i o l a t e d c r i t e r i a :   s t r i n g  
                 }  
                 I n s e r t :   {  
                     a t t a c h m e n t s ? :   J s o n   |   n u l l  
                     a u d i t i d :   s t r i n g  
                     c a u s e :   s t r i n g  
                     c l a s s i f i c a t i o n :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     e f f e c t :   s t r i n g  
                     e v i d e n c e :   s t r i n g  
                     f i n d i n g c o d e :   s t r i n g  
                     i d :   s t r i n g  
                     s t a t u s :   s t r i n g  
                     s u m m a r y :   s t r i n g  
                     v i o l a t e d c r i t e r i a :   s t r i n g  
                 }  
                 U p d a t e :   {  
                     a t t a c h m e n t s ? :   J s o n   |   n u l l  
                     a u d i t i d ? :   s t r i n g  
                     c a u s e ? :   s t r i n g  
                     c l a s s i f i c a t i o n ? :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     e f f e c t ? :   s t r i n g  
                     e v i d e n c e ? :   s t r i n g  
                     f i n d i n g c o d e ? :   s t r i n g  
                     i d ? :   s t r i n g  
                     s t a t u s ? :   s t r i n g  
                     s u m m a r y ? :   s t r i n g  
                     v i o l a t e d c r i t e r i a ? :   s t r i n g  
                 }  
                 R e l a t i o n s h i p s :   [  
                     {  
                         f o r e i g n K e y N a m e :   " f i n d i n g s _ a u d i t i d _ f k e y "  
                         c o l u m n s :   [ " a u d i t i d " ]  
                         i s O n e T o O n e :   f a l s e  
                         r e f e r e n c e d R e l a t i o n :   " a u d i t s "  
                         r e f e r e n c e d C o l u m n s :   [ " i d " ]  
                     } ,  
                 ]  
             }  
             i n s t i t u t i o n s :   {  
                 R o w :   {  
                     c n p j :   s t r i n g  
                     c r e a t e d _ a t :   s t r i n g   |   n u l l  
                     i d :   s t r i n g  
                     m u n i c i p a l i t y n a m e :   s t r i n g  
                     t y p e :   s t r i n g  
                 }  
                 I n s e r t :   {  
                     c n p j :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     i d :   s t r i n g  
                     m u n i c i p a l i t y n a m e :   s t r i n g  
                     t y p e :   s t r i n g  
                 }  
                 U p d a t e :   {  
                     c n p j ? :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     i d ? :   s t r i n g  
                     m u n i c i p a l i t y n a m e ? :   s t r i n g  
                     t y p e ? :   s t r i n g  
                 }  
                 R e l a t i o n s h i p s :   [ ]  
             }  
             p r o f i l e :   {  
                 R o w :   {  
                     c r e a t e d _ a t :   s t r i n g   |   n u l l  
                     e m a i l :   s t r i n g  
                     i d :   n u m b e r  
                     n a m e :   s t r i n g  
                     r o l e :   s t r i n g  
                     s i g n a t u r e :   s t r i n g  
                 }  
                 I n s e r t :   {  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     e m a i l ? :   s t r i n g  
                     i d ? :   n u m b e r  
                     n a m e ? :   s t r i n g  
                     r o l e ? :   s t r i n g  
                     s i g n a t u r e ? :   s t r i n g  
                 }  
                 U p d a t e :   {  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     e m a i l ? :   s t r i n g  
                     i d ? :   n u m b e r  
                     n a m e ? :   s t r i n g  
                     r o l e ? :   s t r i n g  
                     s i g n a t u r e ? :   s t r i n g  
                 }  
                 R e l a t i o n s h i p s :   [ ]  
             }  
             r e c o m m e n d a t i o n s :   {  
                 R o w :   {  
                     c r e a t e d _ a t :   s t r i n g   |   n u l l  
                     d e a d l i n e :   s t r i n g  
                     d e s c r i p t i o n :   s t r i n g  
                     f i n d i n g i d :   s t r i n g  
                     i d :   s t r i n g  
                     i m p l e m e n t a t i o n r e s p o n s i b l e :   s t r i n g  
                     r e c o m m e n d a t i o n c o d e :   s t r i n g  
                     s t a t u s :   s t r i n g  
                     v e r i f i c a t i o n d a t e :   s t r i n g   |   n u l l  
                 }  
                 I n s e r t :   {  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     d e a d l i n e :   s t r i n g  
                     d e s c r i p t i o n :   s t r i n g  
                     f i n d i n g i d :   s t r i n g  
                     i d :   s t r i n g  
                     i m p l e m e n t a t i o n r e s p o n s i b l e :   s t r i n g  
                     r e c o m m e n d a t i o n c o d e :   s t r i n g  
                     s t a t u s :   s t r i n g  
                     v e r i f i c a t i o n d a t e ? :   s t r i n g   |   n u l l  
                 }  
                 U p d a t e :   {  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     d e a d l i n e ? :   s t r i n g  
                     d e s c r i p t i o n ? :   s t r i n g  
                     f i n d i n g i d ? :   s t r i n g  
                     i d ? :   s t r i n g  
                     i m p l e m e n t a t i o n r e s p o n s i b l e ? :   s t r i n g  
                     r e c o m m e n d a t i o n c o d e ? :   s t r i n g  
                     s t a t u s ? :   s t r i n g  
                     v e r i f i c a t i o n d a t e ? :   s t r i n g   |   n u l l  
                 }  
                 R e l a t i o n s h i p s :   [  
                     {  
                         f o r e i g n K e y N a m e :   " r e c o m m e n d a t i o n s _ f i n d i n g i d _ f k e y "  
                         c o l u m n s :   [ " f i n d i n g i d " ]  
                         i s O n e T o O n e :   f a l s e  
                         r e f e r e n c e d R e l a t i o n :   " f i n d i n g s "  
                         r e f e r e n c e d C o l u m n s :   [ " i d " ]  
                     } ,  
                 ]  
             }  
             r i s k s :   {  
                 R o w :   {  
                     a u d i t i d :   s t r i n g  
                     c o n t r o l s :   s t r i n g  
                     c r e a t e d _ a t :   s t r i n g   |   n u l l  
                     d e s c r i p t i o n :   s t r i n g  
                     i d :   s t r i n g  
                     i m p a c t :   s t r i n g  
                     p r o b a b i l i t y :   s t r i n g  
                     r i s k l e v e l :   s t r i n g  
                 }  
                 I n s e r t :   {  
                     a u d i t i d :   s t r i n g  
                     c o n t r o l s :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     d e s c r i p t i o n :   s t r i n g  
                     i d :   s t r i n g  
                     i m p a c t :   s t r i n g  
                     p r o b a b i l i t y :   s t r i n g  
                     r i s k l e v e l :   s t r i n g  
                 }  
                 U p d a t e :   {  
                     a u d i t i d ? :   s t r i n g  
                     c o n t r o l s ? :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     d e s c r i p t i o n ? :   s t r i n g  
                     i d ? :   s t r i n g  
                     i m p a c t ? :   s t r i n g  
                     p r o b a b i l i t y ? :   s t r i n g  
                     r i s k l e v e l ? :   s t r i n g  
                 }  
                 R e l a t i o n s h i p s :   [  
                     {  
                         f o r e i g n K e y N a m e :   " r i s k s _ a u d i t i d _ f k e y "  
                         c o l u m n s :   [ " a u d i t i d " ]  
                         i s O n e T o O n e :   f a l s e  
                         r e f e r e n c e d R e l a t i o n :   " a u d i t s "  
                         r e f e r e n c e d C o l u m n s :   [ " i d " ]  
                     } ,  
                 ]  
             }  
             c u s t o m _ r e p o r t _ s e c t i o n s :   {  
                 R o w :   {  
                     a u d i t i d :   s t r i n g  
                     c o n t e n t :   s t r i n g  
                     c r e a t e d _ a t :   s t r i n g   |   n u l l  
                     i d :   s t r i n g  
                     s e q u e n c e :   n u m b e r  
                     t i t l e :   s t r i n g  
                 }  
                 I n s e r t :   {  
                     a u d i t i d :   s t r i n g  
                     c o n t e n t :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     i d :   s t r i n g  
                     s e q u e n c e :   n u m b e r  
                     t i t l e :   s t r i n g  
                 }  
                 U p d a t e :   {  
                     a u d i t i d ? :   s t r i n g  
                     c o n t e n t ? :   s t r i n g  
                     c r e a t e d _ a t ? :   s t r i n g   |   n u l l  
                     i d ? :   s t r i n g  
                     s e q u e n c e ? :   n u m b e r  
                     t i t l e ? :   s t r i n g  
                 }  
                 R e l a t i o n s h i p s :   [  
                     {  
                         f o r e i g n K e y N a m e :   " c u s t o m _ r e p o r t _ s e c t i o n s _ a u d i t i d _ f k e y "  
                         c o l u m n s :   [ " a u d i t i d " ]  
                         i s O n e T o O n e :   f a l s e  
                         r e f e r e n c e d R e l a t i o n :   " a u d i t s "  
                         r e f e r e n c e d C o l u m n s :   [ " i d " ]  
                     } ,  
                 ]  
             }  
         }  
         V i e w s :   {  
             [ _   i n   n e v e r ] :   n e v e r  
         }  
         F u n c t i o n s :   {  
             [ _   i n   n e v e r ] :   n e v e r  
         }  
         E n u m s :   {  
             [ _   i n   n e v e r ] :   n e v e r  
         }  
         C o m p o s i t e T y p e s :   {  
             [ _   i n   n e v e r ] :   n e v e r  
         }  
     }  
 }  
  
 t y p e   D a t a b a s e W i t h o u t I n t e r n a l s   =   O m i t < D a t a b a s e ,   " _ _ I n t e r n a l S u p a b a s e " >  
  
 t y p e   D e f a u l t S c h e m a   =   D a t a b a s e W i t h o u t I n t e r n a l s [ E x t r a c t < k e y o f   D a t a b a s e ,   " p u b l i c " > ]  
  
 e x p o r t   t y p e   T a b l e s <  
     D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s  
         |   k e y o f   ( D e f a u l t S c h e m a [ " T a b l e s " ]   &   D e f a u l t S c h e m a [ " V i e w s " ] )  
         |   {   s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s   } ,  
     T a b l e N a m e   e x t e n d s   D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s   {  
         s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
     }  
         ?   k e y o f   ( D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " T a b l e s " ]   &  
                 D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " V i e w s " ] )  
         :   n e v e r   =   n e v e r ,  
 >   =   D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s   {  
     s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
 }  
     ?   ( D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " T a b l e s " ]   &  
             D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " V i e w s " ] ) [ T a b l e N a m e ]   e x t e n d s   {  
             R o w :   i n f e r   R  
         }  
         ?   R  
         :   n e v e r  
     :   D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s   k e y o f   ( D e f a u l t S c h e m a [ " T a b l e s " ]   &  
                 D e f a u l t S c h e m a [ " V i e w s " ] )  
         ?   ( D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s ]   e x t e n d s   {  
                 R o w :   i n f e r   R  
             }  
             ?   R  
             :   n e v e r  
         :   n e v e r  
  
 e x p o r t   t y p e   T a b l e s I n s e r t <  
     D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s  
         |   k e y o f   D e f a u l t S c h e m a [ " T a b l e s " ]  
         |   {   s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s   } ,  
     T a b l e N a m e   e x t e n d s   D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s   {  
         s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
     }  
         ?   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " T a b l e s " ]  
         :   n e v e r   =   n e v e r ,  
 >   =   D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s   {  
     s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
 }  
     ?   D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " T a b l e s " ] [ T a b l e N a m e ]   e x t e n d s   {  
             I n s e r t :   i n f e r   I  
         }  
         ?   I  
         :   n e v e r  
     :   D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s   k e y o f   D e f a u l t S c h e m a [ " T a b l e s " ]  
         ?   D e f a u l t S c h e m a [ " T a b l e s " ] [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s ]   e x t e n d s   {  
                 I n s e r t :   i n f e r   I  
             }  
             ?   I  
             :   n e v e r  
         :   n e v e r  
  
 e x p o r t   t y p e   T a b l e s U p d a t e <  
     D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s  
         |   k e y o f   D e f a u l t S c h e m a [ " T a b l e s " ]  
         |   {   s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s   } ,  
     T a b l e N a m e   e x t e n d s   D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s   {  
         s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
     }  
         ?   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " T a b l e s " ]  
         :   n e v e r   =   n e v e r ,  
 >   =   D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s   {  
     s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
 }  
     ?   D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " T a b l e s " ] [ T a b l e N a m e ]   e x t e n d s   {  
             U p d a t e :   i n f e r   U  
         }  
         ?   U  
         :   n e v e r  
     :   D e f a a u l t S c h e m a T a b l e N a m e O r O p t i o n s   e x t e n d s   k e y o f   D e f a u l t S c h e m a [ " T a b l e s " ]  
         ?   D e f a u l t S c h e m a [ " T a b l e s " ] [ D e f a u l t S c h e m a T a b l e N a m e O r O p t i o n s ]   e x t e n d s   {  
                 U p d a t e :   i n f e r   U  
             }  
             ?   U  
             :   n e v e r  
         :   n e v e r  
  
 e x p o r t   t y p e   E n u m s <  
     D e f a u l t S c h e m a E n u m N a m e O r O p t i o n s   e x t e n d s  
         |   k e y o f   D e f a u l t S c h e m a [ " E n u m s " ]  
         |   {   s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s   } ,  
     E n u m N a m e   e x t e n d s   D e f a u l t S c h e m a E n u m N a m e O r O p t i o n s   e x t e n d s   {  
         s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
     }  
         ?   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a E n u m N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " E n u m s " ]  
         :   n e v e r   =   n e v e r ,  
 >   =   D e f a u l t S c h e m a E n u m N a m e O r O p t i o n s   e x t e n d s   {  
     s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
 }  
     ?   D a t a b a s e W i t h o u t I n t e r n a l s [ D e f a u l t S c h e m a E n u m N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " E n u m s " ] [ E n u m N a m e ]  
     :   D e f a u l t S c h e m a E n u m N a m e O r O p t i o n s   e x t e n d s   k e y o f   D e f a u l t S c h e m a [ " E n u m s " ]  
         ?   D e f a u l t S c h e m a [ " E n u m s " ] [ D e f a u l t S c h e m a E n u m N a m e O r O p t i o n s ]  
         :   n e v e r  
  
 e x p o r t   t y p e   C o m p o s i t e T y p e s <  
     P u b l i c C o m p o s i t e T y p e N a m e O r O p t i o n s   e x t e n d s  
         |   k e y o f   D e f a u l t S c h e m a [ " C o m p o s i t e T y p e s " ]  
         |   {   s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s   } ,  
     C o m p o s i t e T y p e N a m e   e x t e n d s   P u b l i c C o m p o s i t e T y p e N a m e O r O p t i o n s   e x t e n d s   {  
         s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
     }  
         ?   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s [ P u b l i c C o m p o s i t e T y p e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " C o m p o s i t e T y p e s " ]  
         :   n e v e r   =   n e v e r ,  
 >   =   P u b l i c C o m p o s i t e T y p e N a m e O r O p t i o n s   e x t e n d s   {  
     s c h e m a :   k e y o f   D a t a b a s e W i t h o u t I n t e r n a l s  
 }  
     ?   D a t a b a s e W i t h o u t I n t e r n a l s [ P u b l i c C o m p o s i t e T y p e N a m e O r O p t i o n s [ " s c h e m a " ] ] [ " C o m p o s i t e T y p e s " ] [ C o m p o s i t e T y p e N a m e ]  
     :   P u b l i c C o m p o s i t e T y p e N a m e O r O p t i o n s   e x t e n d s   k e y o f   D e f a u l t S c h e m a [ " C o m p o s i t e T y p e s " ]  
         ?   D e f a u l t S c h e m a [ " C o m p o s i t e T y p e s " ] [ P u b l i c C o m p o s i t e T y p e N a m e O r O p t i o n s ]  
         :   n e v e r  
  
 e x p o r t   c o n s t   C o n s t a n t s   =   {  
     p u b l i c :   {  
         E n u m s :   { } ,  
     } ,  
 }   a s   c o n s t