/*
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 3 only, as
 * published by the Free Software Foundation.

 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 */

import { DataMapper } from "./DataMapper.js";
import { Alert } from "../../application/Alert.js";
import { Class, isClass } from "../../types/Class.js";
import { Properties } from "../../application/Properties.js";
import { FormsModule } from "../../application/FormsModule.js";
import { ComponentFactory } from "../../application/ComponentFactory.js";


export interface Style
{
	style:string;
	value:string;
}

export class BasicProperties
{
	protected tag$:string = null;
	protected styles$:Style[] = [];
	protected classes$:string[] = [];
	protected mapper$:DataMapper = null;
	protected attribs$:Map<string,string> = new Map<string,string>();

	protected hidden$:boolean = false;
	protected enabled$:boolean = false;
	protected readonly$:boolean = false;
	protected required$:boolean = false;

	protected value$:string = null;
    protected values$:Map<string,string> = new Map<string,string>();

	protected handled$:string[] = ["id","name","block","row","invalid"];
	protected structured$:string[] = ["hidden","enabled","readonly","required","value","class","style","mapper"];

	public get tag() : string
	{
		return(this.tag$);
	}

	public set tag(tag:string)
	{
		this.tag$ = tag?.toLowerCase();
	}

	public get enabled() : boolean
	{
		return(this.enabled$);
	}

	public set enabled(flag:boolean)
	{
		this.enabled$ = flag;
	}

	public get readonly() : boolean
	{
		return(this.readonly$);
	}

	public set readonly(flag:boolean)
	{
		this.readonly$ = flag;
	}

	public get required() : boolean
	{
		return(this.required$);
	}

	public set required(flag:boolean)
	{
		this.required$ = flag;
	}

	public get hidden() : boolean
	{
		return(this.hidden$);
	}

	public set hidden(flag:boolean)
	{
		this.hidden$ = flag;
	}

	public get styleElements() : Style[]
	{
		return(this.styles$);
	}

	public getStyles() : Style[]
	{
		return(this.styles$);
	}

	public get style() : string
	{
		let style:string = "";
		this.styles$.forEach((element) => {style += element.style+":"+element.value+";"});
		return(style)
	}

	public set styles(styles:string)
	{
		let elements:string[] = styles.split(";")

		for (let i = 0; i < elements.length; i++)
		{
			let element:string = elements[i].trim();

			if (element.length > 0)
			{
				let pos:number = element.indexOf(':');

				if (pos > 0)
				{
					let style:string = element.substring(0,pos).trim();
					let value:string = element.substring(pos+1).trim();

					this.setStyle(style,value);
				}
			}
		}
	}

	public setStyles(styles:string) : void
	{
		this.styles = styles;
	}

	public setStyle(style:string, value:string) : void
	{
		value = value.toLowerCase();
		style = style.toLowerCase();

		this.removeStyle(style);
		this.styles$.push({style: style, value: value});
	}

	public removeStyle(style:string) : void
	{
		style = style.toLowerCase();

		for (let i = 0; i < this.styles$.length; i++)
		{
			if (this.styles$[i].style == style)
			{
				this.styles$ = this.styles$.splice(i,1);
				break;
			}
		}
	}

	public setClass(clazz:string) : void
	{
		if (clazz == null)
			return;

		clazz = clazz.trim();

		if (clazz.includes(' '))
		{
			this.setClasses(clazz);
			return;
		}

		clazz = clazz.toLowerCase();

		if (this.classes$[clazz] == null)
			this.classes$.push(clazz);
	}

	public setClasses(classes:string|string[]) : void
	{
		this.classes$ = [];

		if (classes == null)
			return;

		if (!Array.isArray(classes))
			classes = classes.split(" ,");

		for(let clazz in classes)
		{
			if (clazz.length > 0)
				this.classes$.push(clazz.toLowerCase());
		}
	}

	public getClasses() : string[]
	{
		return(this.classes$);
	}

	public hasClass(clazz:string) : boolean
	{
		clazz = clazz.toLowerCase();
		return(this.classes$.includes(clazz));
	}

	public removeClass(clazz:any) : void
	{
		clazz = clazz.toLowerCase();
		let idx:number = this.classes$.indexOf(clazz);
		if (idx >= 0) this.classes$ = this.classes$.splice(idx,1)
	}

	public getAttributes() : Map<string,string>
	{
		return(this.attribs$);
	}

	public getAttribute(attr:string) : string
	{
		return(this.attribs$.get(attr.toLowerCase()));
	}

	public setAttribute(attr:string, value:any) : any
	{
		attr = attr.toLowerCase();

		if (this.handled$.includes(attr))
			return;

		if (this.structured$.includes(attr))
		{
			let flag:boolean = true;

			if (value != null && value.toLowerCase() == "false")
				flag = false;

			switch(attr)
			{
				case "hidden": this.hidden = flag; break;
				case "enabled": this.enabled = flag; break;
				case "readonly": this.readonly = flag; break;
				case "required": this.required = flag; break;

				case "style": this.setStyles(value); break;
				case "class": this.setClasses(value); break;

				case "mapper": this.setMapper(value); break;
			}

			return;
		}

		let val:string = "";
		attr = attr.toLowerCase();

		if (value != null)
			val += value;

		this.attribs$.set(attr,val);
	}

	public removeAttribute(attr:string) : any
	{
		attr = attr.toLowerCase();
		this.attribs$.delete(attr.toLowerCase());
		return(this);
	}

	public get value() : string
	{
		return(this.value$);
	}

	public set value(value:string)
	{
		this.value$ = null;

		if (value != null)
		{
			this.value$ = value.trim();
			if (this.value$.length == 0)
				this.value$ = null;
		}
	}

    public get validValues() : Map<string,string>
	{
		return(this.values$);
    }

    public set validValues(values: Set<string> | Map<string,string>)
	{
		if (values instanceof Set)
		{
			this.values$ = new Map<string,string>();
			values.forEach((value) => {this.values$.set(value,value)});
		}
        else this.values$ = values;
    }

    public setValidValues(values: Set<string> | Map<string,string>) : void
	{
		this.validValues = values;
	}

    public getValidValues() : Map<string,string>
	{
		return(this.values$);
    }

	public get mapper() : DataMapper
	{
		return(this.mapper$);
	}

	public set mapper(mapper:DataMapper)
	{
		this.mapper$ = mapper;
	}

	public setMapper(mapper:Class<DataMapper>|DataMapper|string) : void
	{
		let factory:ComponentFactory =
			Properties.FactoryImplementationClass;

		if (typeof mapper === "string")
			mapper = FormsModule.get().getComponent(mapper);

		if (isClass(mapper))
			this.mapper$ = factory.createBean(mapper) as DataMapper;

		if (this.mapper$ != null && !("getIntermediateValue" in this.mapper$))
		{
			Alert.fatal("'"+this.mapper$.constructor.name+"' is not a DataMapper","DataMapper");
			this.mapper$ = null;
		}
	}
}
