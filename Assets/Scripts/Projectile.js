#pragma strict

//public var colliderLayerMask : int;
public var colliderLayerMask : LayerMask;
public var damageValue : float;
public var forceValue : float = 10;

public var velocity : Vector3;
public var lifespan : float = 3;

public var bDebug : boolean = false;

function Start () {

}

function Update () {
	
}

function FixedUpdate () 
{
	transform.position += velocity * Time.deltaTime;
	lifespan -= Time.fixedDeltaTime;
	if(lifespan < 0) Destroy(this.gameObject);
}

function OnCollisionEnter(collision : Collision) 
{
	if(bDebug) Debug.Log("Projectile Collision!");
	var collisionHealth : BaseHealth;
	
	//If I should collide with the collision object, and it has health, deal damage to it.
	//Cease to be afterwards, even if the collision object doesn't have health.
	
	if(((1 << collision.gameObject.layer) & colliderLayerMask.value) > 0)
	{
		if(bDebug) Debug.Log("Projectile mask overlap " );
		collisionHealth = collision.gameObject.GetComponent(BaseHealth);
		if(collisionHealth)
		{
			collisionHealth.ReceiveDamage(damageValue);
		}
		damageValue = 0;
		Destroy(this.gameObject);
	}
}


function OnTriggerEnter (other : Collider) 
{
    if(bDebug) Debug.Log("Projectile Trigger");
    var collisionHealth : BaseHealth;
    var force : float = damageValue / 5;
    
    
    
    if(((1 << other.gameObject.layer) & colliderLayerMask.value) > 0)
    {
    	collisionHealth = other.gameObject.GetComponent(BaseHealth);
    	if(!collisionHealth && other.transform.parent) collisionHealth = other.transform.root.GetComponent(BaseHealth);
    	
		if(damageValue > 0 && collisionHealth)
		{
			collisionHealth.ReceiveDamage(damageValue);
		}
		
		if(other.rigidbody && damageValue > 0)
		{
			if(bDebug) Debug.Log("Projectile impact: " + transform.position);
			//This is strangely unsatisfying of an impact force...
			//other.rigidbody.AddExplosionForce(forceValue, transform.position,0,0, ForceMode.Impulse);
			//Convert the velocity to apply the force to the target object, rather than all this explosion force nonsense.
			other.rigidbody.AddForce(velocity, ForceMode.Impulse);
		}
		
		damageValue = 0;
		Destroy(this.gameObject);
    }
}

