@@ .. @@
           <NavigationMenuTrigger>Countries</NavigationMenuTrigger>
           <NavigationMenuContent>
             <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
               <li className="row-span-3">
                 <NavigationMenuLink asChild>
                   <a
                     className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                     href="/"
                   >
                     <div className="mb-2 mt-4 text-lg font-medium">
                       Global Reach
                     </div>
                     <p className="text-sm leading-tight text-muted-foreground">
                       Company formation services available in multiple jurisdictions worldwide.
                     </p>
                   </a>
                 </NavigationMenuLink>
               </li>
               <ListItem href="/countries/uk" title="United Kingdom">
                 Fast and efficient UK company formation
               </ListItem>
               <ListItem href="/countries/usa" title="United States">
                 Delaware and other state incorporations
               </ListItem>
               <ListItem href="/countries/singapore" title="Singapore">
                 Asian business hub incorporation
               </ListItem>
             </ul>
           </NavigationMenuContent>
         </NavigationMenuItem>
+        <NavigationMenuItem>
+          <NavigationMenuLink asChild>
+            <Link 
+              to="/order" 
+              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:bg-red-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
+            >
+              Start Company
+            </Link>
+          </NavigationMenuLink>
+        </NavigationMenuItem>
       </NavigationMenuList>
     </NavigationMenu>
   )